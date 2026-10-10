/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiGet, apiPatch, apiPost, ApiResponse } from "@/services/fetchClient/fetchClient";

export interface IPayoutDriverInfo {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
  avatarUrl?: string;
}

export interface IPayoutWalletInfo {
  id: string;
  driverId: string;
  balance: string | number;
  totalEarnings: string | number;
  totalCommissionPaid: string | number;
  totalWithdrawn: string | number;
  currency: string;
}

export interface IPayoutRequestItem {
  id: string;
  driverId: string;
  walletId: string;
  amount: string | number;
  paymentMethod: string;
  accountNumber: string;
  accountDetails?: string;
  status: 'REQUESTED' | 'PROCESSING' | 'APPROVED' | 'REJECTED';
  processedAt?: string | null;
  processedById?: string | null;
  rejectionReason?: string | null;
  transactionReference?: string | null;
  createdAt: string;
  updatedAt: string;
  driver?: IPayoutDriverInfo;
  wallet?: IPayoutWalletInfo;
}

export interface IPayoutRequestFilter {
  page?: number;
  limit?: number;
  status?: string;
  driverId?: string;
}

export interface IProcessPayoutPayload {
  status: 'APPROVED' | 'REJECTED' | 'PROCESSING';
  transactionReference?: string;
  rejectionReason?: string;
}

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
  accountNumber?: string;
  accountDetails?: string;
  notes?: string;
}): Promise<ApiResponse<any>> {
  return apiPost("/wallets/payout-request", payload);
}

/**
 * 4. Super Admin: Get all payout requests
 */
export async function getAllPayoutRequestsAction(
  params?: IPayoutRequestFilter
): Promise<ApiResponse<IPayoutRequestItem[]>> {
  return apiGet("/wallets/admin/payouts", { params: params as any });
}

/**
 * 5. Super Admin: Process (Approve / Reject / Processing) payout request
 */
export async function processPayoutRequestAction(
  id: string,
  payload: IProcessPayoutPayload
): Promise<ApiResponse<IPayoutRequestItem>> {
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
