/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiDelete, apiGet, apiPatch, apiPost, ApiResponse } from "@/services/fetchClient/fetchClient";

export interface ISettingPayload {
  key: string;
  value: string;
  category?: string;
  description?: string;
  isPublic?: boolean;
}

/**
 * 1. Get public platform settings (Hotline, maintenance, app version)
 */
export async function getPublicSettingsAction(): Promise<ApiResponse<Record<string, any>>> {
  return apiGet("/settings/public");
}

/**
 * 2. Super Admin: Get all settings
 */
export async function getAllSettingsAction(): Promise<ApiResponse<any[]>> {
  return apiGet("/settings");
}

/**
 * 3. Super Admin: Upsert setting
 */
export async function upsertSettingAction(payload: ISettingPayload): Promise<ApiResponse<any>> {
  return apiPost("/settings", payload);
}

/**
 * 4. Super Admin: Update setting by key
 */
export async function updateSettingAction(
  key: string,
  payload: Partial<ISettingPayload>
): Promise<ApiResponse<any>> {
  return apiPatch(`/settings/${key}`, payload);
}

/**
 * 5. Super Admin: Delete setting
 */
export async function deleteSettingAction(key: string): Promise<ApiResponse<any>> {
  return apiDelete(`/settings/${key}`);
}
