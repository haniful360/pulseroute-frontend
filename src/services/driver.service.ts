/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiGet, apiPatch, ApiResponse } from "./fetchClient";

export interface IUpdateDriverProfilePayload {
  name?: string;
  phone?: string;
  contactNumber?: string;
  avatarUrl?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  licensePhotoUrl?: string;
  licensePhotos?: string[];
  nidNumber?: string;
  nidPhotoUrl?: string;
  nidPhotos?: string[];
  experienceYears?: number;
  vehicleNumber?: string;
  ambulanceType?: 'BASIC' | 'AC' | 'ICU' | 'CCU' | 'FREEZER' | 'NEONATAL';
  model?: string;
  manufacturer?: string;
  year?: number;
  vehiclePhotoUrl?: string;
  vehiclePhotos?: string[];
  hasOxygen?: boolean;
  hasVentilator?: boolean;
  hasDefibrillator?: boolean;
  hasSuctionMachine?: boolean;
  equipmentDetails?: string;
}

export interface IVerifyDriverPayload {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  reason?: string;
}

export interface IDriverFilterRequest {
  searchTerm?: string;
  verificationStatus?: string;
  dutyStatus?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 1. Get Driver Dashboard Overview metrics
 */
export async function getDriverDashboardOverviewAction(): Promise<ApiResponse<any>> {
  return apiGet("/drivers/dashboard");
}

/**
 * 2. Get current authenticated driver profile
 */
export async function getMyDriverProfileAction(): Promise<ApiResponse<any>> {
  return apiGet("/drivers/my-profile");
}

/**
 * 3. Update current driver profile & vehicle
 */
export async function updateMyDriverProfileAction(
  payload: IUpdateDriverProfilePayload
): Promise<ApiResponse<any>> {
  return apiPatch("/drivers/my-profile", payload);
}

/**
 * 4. Toggle driver duty status (ONLINE / OFFLINE)
 */
export async function updateDutyStatusAction(
  dutyStatus: 'ONLINE' | 'OFFLINE' | 'BUSY' | { dutyStatus: 'ONLINE' | 'OFFLINE' | 'BUSY' | string }
): Promise<ApiResponse<any>> {
  const status = typeof dutyStatus === 'object' ? dutyStatus.dutyStatus : dutyStatus;
  return apiPatch("/drivers/duty-status", { dutyStatus: status });
}

/**
 * 5. Update driver GPS coordinates
 */
export async function updateDriverLocationAction(payload: {
  latitude: number;
  longitude: number;
}): Promise<ApiResponse<any>> {
  return apiPatch("/drivers/location", payload);
}

/**
 * 6. Super Admin: Get all drivers with filters & pagination
 */
export async function getAllDriversAction(
  params?: IDriverFilterRequest
): Promise<ApiResponse<{ meta: any; data: any[] }>> {
  return apiGet("/drivers", { params: params as Record<string, unknown> });
}

/**
 * 7. Super Admin: Get driver by ID
 */
export async function getDriverByIdAction(id: string): Promise<ApiResponse<any>> {
  return apiGet(`/drivers/${id}`);
}

/**
 * 8. Super Admin: Verify / Approve / Reject driver
 */
export async function verifyDriverAction(
  id: string,
  payload: IVerifyDriverPayload
): Promise<ApiResponse<any>> {
  return apiPatch(`/drivers/${id}/verify`, payload);
}
