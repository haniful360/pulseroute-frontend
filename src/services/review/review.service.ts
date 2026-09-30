/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiDelete, apiGet, apiPost, ApiResponse } from "@/services/fetchClient/fetchClient";

export interface ICreateReviewPayload {
  tripId: string;
  rating: number;
  comment?: string;
}

/**
 * 1. Submit review for completed emergency trip
 */
export async function createReviewAction(
  payload: ICreateReviewPayload
): Promise<ApiResponse<any>> {
  return apiPost("/reviews", payload);
}

/**
 * 2. Get my reviews (Patient or Driver)
 */
export async function getMyReviewsAction(): Promise<ApiResponse<any[]>> {
  return apiGet("/reviews/my-reviews");
}

/**
 * 3. Get reviews for specific driver
 */
export async function getDriverReviewsAction(
  driverId: string
): Promise<ApiResponse<any[]>> {
  return apiGet(`/reviews/driver/${driverId}`);
}

/**
 * 4. Super Admin: Get all reviews
 */
export async function getAllReviewsAction(
  params?: Record<string, unknown>
): Promise<ApiResponse<{ meta: any; data: any[] }>> {
  return apiGet("/reviews", { params });
}

/**
 * 5. Super Admin: Delete review
 */
export async function deleteReviewAction(id: string): Promise<ApiResponse<any>> {
  return apiDelete(`/reviews/${id}`);
}
