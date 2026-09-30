/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiGet, apiPatch, apiPost, ApiResponse } from "./fetchClient";

/**
 * 1. Get driver's wallet and balance
 */
export async function getMyWalletAction(): Promise<ApiResponse<any>> {
  return apiGet("/wallets/my-wallet");
}

/**
 * 2. Get driver's wallet transactions
 */
export async function getMyTransactionsAction(
  params?: any
): Promise<ApiResponse<any>> {
  return apiGet("/wallets/my-transactions", { params });
}

/**
 * 3. Request payout to bank / Stripe
 */
export async function createPayoutRequestAction(payload: {
  amount: number;
  paymentMethod?: 'STRIPE' | 'BANK_TRANSFER' | 'BKASH';
  notes?: string;
}): Promise<ApiResponse<any>> {
  return apiPost("/wallets/payout-request", payload);
}

/**
 * 4. Super Admin: Get all payout requests
 */
export async function getAllPayoutRequestsAction(
  params?: any
): Promise<ApiResponse<any>> {
  return apiGet("/wallets/admin/payouts", { params });
}

/**
 * 5. Super Admin: Process (Approve / Reject) payout request
 */
export async function processPayoutRequestAction(
  id: string,
  payload: { status: 'APPROVED' | 'REJECTED'; adminNotes?: string }
): Promise<ApiResponse<any>> {
  return apiPatch(`/wallets/admin/payouts/${id}`, payload);
}

/**
 * 6. Driver: Download Earning & Ledger Statement CSV
 */
export async function exportDriverStatementAction(
  params?: { startDate?: string; endDate?: string; type?: string }
): Promise<ApiResponse<string>> {
  return apiGet("/wallets/statement/export", { params });
}

