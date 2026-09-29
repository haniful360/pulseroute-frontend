/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiGet, ApiResponse } from "./fetchClient";

/**
 * 1. Get user's or driver's invoices
 */
export async function getMyInvoicesAction(): Promise<ApiResponse<any[]>> {
  return apiGet("/invoices/my-invoices");
}

/**
 * 2. Super Admin: Get all invoices
 */
export async function getAllInvoicesAction(
  params?: any
): Promise<ApiResponse<{ meta?: any; data: any[] }>> {
  return apiGet("/invoices", { params });
}

/**
 * 3. Get invoice by ID
 */
export async function getInvoiceByIdAction(id: string): Promise<ApiResponse<any>> {
  return apiGet(`/invoices/${id}`);
}
