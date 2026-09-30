/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { apiDelete, apiGet, apiPatch, apiPost, ApiResponse } from "./fetchClient";

export interface INotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface INotificationResponse {
  notifications: INotificationItem[];
  unreadCount: number;
  meta?: any;
}

export interface IBroadcastPayload {
  title: string;
  message: string;
  targetAudience?: 'ALL' | 'DRIVERS' | 'USERS';
  priority?: 'NORMAL' | 'URGENT' | 'CRITICAL';
}

/**
 * 1. Get authenticated user's notifications
 */
export async function getMyNotificationsAction(): Promise<ApiResponse<INotificationResponse>> {
  return apiGet("/notifications");
}

/**
 * 2. Mark all notifications as read
 */
export async function markAllNotificationsReadAction(): Promise<ApiResponse<any>> {
  return apiPatch("/notifications/read-all");
}

/**
 * 3. Mark single notification as read
 */
export async function markNotificationReadAction(id: string): Promise<ApiResponse<any>> {
  return apiPatch(`/notifications/${id}/read`);
}

/**
 * 4. Delete notification
 */
export async function deleteNotificationAction(id: string): Promise<ApiResponse<any>> {
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
