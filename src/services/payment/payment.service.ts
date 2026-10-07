/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiPost, ApiResponse } from "@/services/fetchClient/fetchClient";

export interface ICreatePaymentIntentPayload {
  invoiceId: string;
}

export interface IConfirmPaymentPayload {
  invoiceId: string;
  paymentIntentId: string;
  paymentMethodId?: string;
}

/**
 * 1. Create Stripe Payment Intent for an Invoice
 */
export async function createPaymentIntentAction(
  payload: ICreatePaymentIntentPayload
): Promise<ApiResponse<{ clientSecret: string; paymentIntentId: string }>> {
  return apiPost("/payments/create-intent", payload);
}

/**
 * 2. Confirm and settle payment via client paymentIntentId
 */
export async function confirmPaymentAction(
  payload: IConfirmPaymentPayload
): Promise<ApiResponse<any>> {
  return apiPost("/payments/confirm", payload);
}
