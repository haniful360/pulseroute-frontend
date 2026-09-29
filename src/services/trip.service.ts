/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiGet, apiPatch, apiPost, ApiResponse } from "./fetchClient";

export interface ICreateTripPayload {
  ambulanceType: 'BASIC' | 'AC' | 'ICU' | 'CCU' | 'FREEZER' | 'NEONATAL';
  emergencySeverity?: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationAddress?: string;
  destinationLatitude?: number;
  destinationLongitude?: number;
  patientNotes?: string;
}

export interface IUpdateTripStatusPayload {
  status: 'EN_ROUTE' | 'ARRIVED' | 'IN_TRANSIT' | 'COMPLETED';
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface ICancelTripPayload {
  cancellationReason: string;
}

export interface ITripFilterRequest {
  searchTerm?: string;
  status?: string;
  ambulanceType?: string;
  emergencySeverity?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 1. Create a new emergency trip request
 */
export async function createTripAction(
  payload: ICreateTripPayload
): Promise<ApiResponse<any>> {
  return apiPost("/trips", payload);
}

/**
 * 2. Get incoming dispatch offers for driver
 */
export async function getMyOffersAction(
  filter?: { status?: string; includeExpired?: string }
): Promise<ApiResponse<any[]>> {
  return apiGet("/trips/offers/my-offers", { params: filter });
}

/**
 * 3. Driver accepts dispatch offer
 */
export async function acceptDispatchOfferAction(
  offerId: string
): Promise<ApiResponse<any>> {
  return apiPatch(`/trips/offers/${offerId}/accept`);
}

/**
 * 4. Driver rejects dispatch offer
 */
export async function rejectDispatchOfferAction(
  offerId: string
): Promise<ApiResponse<any>> {
  return apiPatch(`/trips/offers/${offerId}/reject`);
}

/**
 * 5. Update trip status along the sequential emergency pipeline
 */
export async function updateTripStatusAction(
  tripId: string,
  payload: IUpdateTripStatusPayload
): Promise<ApiResponse<any>> {
  return apiPatch(`/trips/${tripId}/status`, payload);
}

/**
 * 6. Cancel trip with reason
 */
export async function cancelTripAction(
  tripId: string,
  payload: ICancelTripPayload
): Promise<ApiResponse<any>> {
  return apiPatch(`/trips/${tripId}/cancel`, payload);
}

/**
 * 7. Get my trips (for Patient or Driver)
 */
export async function getMyTripsAction(): Promise<ApiResponse<any[]>> {
  return apiGet("/trips/my-trips");
}

/**
 * 8. Get specific trip details by ID
 */
export async function getTripByIdAction(id: string): Promise<ApiResponse<any>> {
  return apiGet(`/trips/${id}`);
}

/**
 * 9. Super Admin: Get all trips with pagination & filters
 */
export async function getAllTripsAction(
  params?: ITripFilterRequest
): Promise<ApiResponse<{ meta: any; data: any[] }>> {
  return apiGet("/trips", { params: params as Record<string, unknown> });
}
