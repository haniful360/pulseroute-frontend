/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiGet, ApiResponse } from "@/services/fetchClient/fetchClient";

/**
 * Super Admin: Get real-time overview analytics and KPIs
 */
export async function getOverviewAnalyticsAction(): Promise<ApiResponse<any>> {
  return apiGet("/analytics/overview");
}

/**
 * Super Admin: Get recent platform activities
 */
export async function getRecentActivitiesAction(): Promise<ApiResponse<any>> {
  return apiGet("/analytics/recent-activities");
}
