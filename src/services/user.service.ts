/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiDelete, apiGet, apiPatch, ApiResponse } from "./fetchClient";

export interface IUpdateProfilePayload {
  name?: string;
  phone?: string;
  contactNumber?: string;
  avatarUrl?: string;
  address?: string;
  emergencyContactNumber?: string;
  bloodGroup?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  medicalHistory?: string;
  profilePhoto?: string;
  orgEmail?: string;
  department?: string;
  nidNumber?: string;
  licenseExpiry?: string;
  experienceYears?: number;
}

export interface IUserFilterRequest {
  searchTerm?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 1. Get Patient Dashboard Overview metrics
 */
export async function getUserDashboardOverviewAction(): Promise<ApiResponse<any>> {
  return apiGet("/users/dashboard");
}

/**
 * 2. Get current user's profile
 */
export async function getMyProfileAction(): Promise<ApiResponse<any>> {
  return apiGet("/users/profile");
}

/**
 * 3. Update current user's profile
 */
export async function updateMyProfileAction(
  payload: IUpdateProfilePayload
): Promise<ApiResponse<any>> {
  return apiPatch("/users/profile", payload);
}

/**
 * 4. Super Admin: Get all users with filters and pagination
 */
export async function getAllUsersAction(
  params?: IUserFilterRequest
): Promise<ApiResponse<{ meta: any; data: any[] }>> {
  return apiGet("/users", { params: params as Record<string, unknown> });
}

/**
 * 5. Super Admin: Get user by ID
 */
export async function getUserByIdAction(id: string): Promise<ApiResponse<any>> {
  return apiGet(`/users/${id}`);
}

/**
 * 6. Super Admin: Update user status (ACTIVE, BLOCKED, PENDING_APPROVAL)
 */
export async function updateUserStatusAction(
  id: string,
  payload: { status: 'ACTIVE' | 'BLOCKED' | 'PENDING_APPROVAL' }
): Promise<ApiResponse<any>> {
  return apiPatch(`/users/${id}/status`, payload);
}

/**
 * 7. Super Admin: Soft delete user
 */
export async function deleteUserAction(id: string): Promise<ApiResponse<any>> {
  return apiDelete(`/users/${id}`);
}
