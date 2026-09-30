/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiGet, apiPost, ApiResponse } from "./fetchClient";

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

/**
 * 4. Generate invoice for completed trip
 */
export async function generateInvoiceAction(tripId: string): Promise<ApiResponse<any>> {
  return apiPost(`/invoices/generate/${tripId}`);
}

/**
 * 5. Super Admin: Export all invoices financial audit as RFC 4180 CSV
 */
export async function exportInvoicesCsvAction(params?: any): Promise<ApiResponse<string>> {
  return apiGet("/invoices/export/csv", { params });
}

/**
 * 6. Download official itemized medical trip receipt CSV
 */
export async function exportInvoiceReceiptAction(id: string): Promise<ApiResponse<string>> {
  return apiGet(`/invoices/${id}/receipt/export`);
}

