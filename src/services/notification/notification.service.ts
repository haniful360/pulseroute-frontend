/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiDelete, apiGet, apiPatch, apiPost, ApiResponse } from "@/services/fetchClient/fetchClient";

export type NotificationType = 'TRIP' | 'PAYMENT' | 'WALLET' | 'ACCOUNT' | 'SYSTEM';

export interface INotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType | string;
  isRead: boolean;
  link?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt?: string;
}

export interface INotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  unreadCount: number;
}

export interface INotificationFilterParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType | string;
}

export interface IBroadcastPayload {
  title: string;
  message: string;
  targetAudience?: 'ALL' | 'DRIVERS' | 'USERS';
  priority?: 'NORMAL' | 'URGENT' | 'CRITICAL';
}

/**
 * 1. Get authenticated user's notifications (with meta.unreadCount and pagination)
 */
export async function getMyNotificationsAction(
  params?: INotificationFilterParams
): Promise<ApiResponse<INotificationItem[]>> {
  return apiGet("/notifications", params ? { params: params as Record<string, unknown> } : undefined);
}

/**
 * 2. Mark all notifications as read
 */
export async function markAllNotificationsReadAction(): Promise<
  ApiResponse<{ updatedCount: number; message: string }>
> {
  return apiPatch("/notifications/read-all");
}

/**
 * 3. Mark single notification as read
 */
export async function markNotificationReadAction(
  id: string
): Promise<ApiResponse<INotificationItem>> {
  return apiPatch(`/notifications/${id}/read`);
}

/**
 * 4. Delete notification
 */
export async function deleteNotificationAction(
  id: string
): Promise<ApiResponse<{ message: string }>> {
  return apiDelete(`/notifications/${id}`);
}

/**
 * 5. Super Admin: Dispatch emergency broadcast or platform announcement
 */
export async function createBroadcastAnnouncementAction(
  payload: IBroadcastPayload
): Promise<ApiResponse<any>> {
  return apiPost("/notifications/broadcast", payload);
}

/**
 * 6. Super Admin: Get past broadcast announcements
 */
export async function getBroadcastAnnouncementsAction(): Promise<ApiResponse<any[]>> {
  return apiGet("/notifications/broadcasts");
}
