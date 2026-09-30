/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiGet, apiPatch, apiPost, ApiResponse } from "@/services/fetchClient/fetchClient";

export interface IEstimateFarePayload {
  ambulanceType: 'BASIC' | 'AC' | 'ICU' | 'CCU' | 'FREEZER' | 'NEONATAL';
  distanceKm: number;
  estimatedDurationMins?: number;
  isNight?: boolean;
  emergencySeverity?: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
}

export interface IUpdatePricingPayload {
  baseFare?: number;
  perKmRate?: number;
  perMinuteRate?: number;
  platformCommissionRate?: number;
  nightSurgeMultiplier?: number;
  emergencySurgeMultiplier?: number;
  minFare?: number;
  minimumFare?: number;
  cancellationFee?: number;
  isActive?: boolean;
}

/**
 * 1. Get all pricing configs
 */
export async function getAllPricingConfigsAction(): Promise<ApiResponse<any[]>> {
  return apiGet("/pricing");
}

/**
 * 2. Get pricing for specific ambulance type
 */
export async function getPricingConfigByTypeAction(
  type: string
): Promise<ApiResponse<any>> {
  return apiGet(`/pricing/${type}`);
}

/**
 * 3. Dynamic fare estimation calculation
 */
export async function estimateFareAction(
  payload: IEstimateFarePayload
): Promise<ApiResponse<any>> {
  return apiPost("/pricing/estimate-fare", payload);
}

/**
 * 4. Super Admin: Update pricing configuration for an ambulance type
 */
export async function updatePricingConfigAction(
  type: string,
  payload: IUpdatePricingPayload
): Promise<ApiResponse<any>> {
  return apiPatch(`/pricing/${type}`, payload);
}
