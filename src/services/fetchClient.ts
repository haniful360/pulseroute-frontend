/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { cookies } from "next/headers"

export interface FetchOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, unknown>
  tags?: string[]
  revalidate?: number
  body?: unknown
}

async function getAuthHeaders() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value || null
  const headers: Record<string, string> = {}
  if (accessToken) {
    headers["Cookie"] = `accessToken=${accessToken}`
    headers["Authorization"] = `Bearer ${accessToken}`
  }
  return headers
}

function buildUrl(path: string, params?: Record<string, unknown>): string {
  const baseUrl = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    "http://localhost:5000/api/v1"
  ).replace(/\/+$/, "")
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  const url = new URL(`${baseUrl}${cleanPath}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    })
  }
  return url.toString()
}

export interface ApiFetchResult<T = any> {
  success: boolean
  statusCode?: number
  message?: string
  data?: T
  errorSources?: any[]
  [key: string]: any
}

async function request<T>(method: string, path: string, options: FetchOptions = {}): Promise<T> {
  const authHeaders = await getAuthHeaders()
  const { params, tags, revalidate, body, ...rest } = options

  const headers: Record<string, string> = { ...authHeaders }

  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const nextOptions: Record<string, unknown> = {}
  if (tags) nextOptions.tags = tags
  if (revalidate !== undefined) nextOptions.revalidate = revalidate

  try {
    const res = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
      ...(Object.keys(nextOptions).length ? { next: nextOptions } : {}),
      ...rest,
    } as RequestInit)

    let result: any = null
    const contentType = res.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      result = await res.json()
    } else {
      const text = await res.text()
      result = { message: text || res.statusText }
    }

    if (!res.ok) {
      return {
        success: false,
        statusCode: res.status,
        message: result?.message || "Request failed",
        errorSources: result?.errorSources,
      } as unknown as T
    }

    return result as T
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      message: error?.message || "Network request failed. Is the server running?",
    } as unknown as T
  }
}

export async function apiGet<T = any>(path: string, options?: FetchOptions) {
  return request<T>("GET", path, options)
}

export async function apiPost<T = any>(path: string, body?: unknown, options?: FetchOptions) {
  return request<T>("POST", path, { ...options, body })
}

export async function apiPatch<T = any>(path: string, body?: unknown, options?: FetchOptions) {
  return request<T>("PATCH", path, { ...options, body })
}

export async function apiPut<T = any>(path: string, body?: unknown, options?: FetchOptions) {
  return request<T>("PUT", path, { ...options, body })
}

export async function apiDelete<T = any>(path: string, options?: FetchOptions) {
  return request<T>("DELETE", path, options)
}
