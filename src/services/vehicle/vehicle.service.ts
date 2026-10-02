/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiGet, apiPatch, apiPost, ApiResponse } from "@/services/fetchClient/fetchClient";

export interface IVehicleFilterRequest {
  searchTerm?: string;
  ambulanceType?: string;
  verificationStatus?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 1. Get driver's own vehicles
 */
export async function getMyVehiclesAction(): Promise<ApiResponse<any[]>> {
  return apiGet("/vehicles/my-vehicles");
}

/**
 * 2. Super Admin: Get all fleet vehicles
 */
export async function getAllVehiclesAction(
  params?: IVehicleFilterRequest
): Promise<ApiResponse<{ meta: any; data: any[] }>> {
  return apiGet("/vehicles", { params: params as Record<string, unknown> });
}

/**
 * 3. Get vehicle by ID
 */
export async function getVehicleByIdAction(id: string): Promise<ApiResponse<any>> {
  return apiGet(`/vehicles/${id}`);
}

/**
 * 4. Register new vehicle
 */
export async function createVehicleAction(
  payload: any
): Promise<ApiResponse<any>> {
  return apiPost("/vehicles", payload);
}

/**
 * 5. Update vehicle specs & equipment
 */
export async function updateVehicleAction(
  id: string,
  payload: any
): Promise<ApiResponse<any>> {
  return apiPatch(`/vehicles/${id}`, payload);
}

/**
 * 6. Super Admin: Verify / Approve vehicle
 */
export async function verifyVehicleAction(
  id: string,
  payload: { status: 'APPROVED' | 'REJECTED' | 'PENDING'; reason?: string; rejectionReason?: string }
): Promise<ApiResponse<any>> {
  return apiPatch(`/vehicles/${id}/verify`, {
    status: payload.status,
    reason: payload.reason || payload.rejectionReason,
  });
}
