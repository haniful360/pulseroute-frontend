/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { apiGet, apiPost } from "./fetchClient";
import {
  ApiResponse,
  IAuthData,
  IChangePasswordPayload,
  IForgotPasswordPayload,
  IGoogleLoginPayload,
  ILoginUserPayload,
  IMeResponseData,
  IRegisterDriverPayload,
  IRegisterUserPayload,
  IResendOtpPayload,
  IResetPasswordPayload,
  IVerifyOtpPayload,
} from "@/types/auth.types";

/**
 * Persists accessToken and refreshToken as HTTP-only cookies in Next.js
 */
async function setAuthCookies(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }
}

/**
 * Clears authentication cookies
 */
async function removeAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

/**
 * 1. Register Patient/User (sends 6-digit OTP to email)
 */
export async function registerUserAction(
  payload: IRegisterUserPayload
): Promise<ApiResponse<{ email: string; expiresIn: string }>> {
  return apiPost("/auth/register", payload);
}

/**
 * 2. Register Driver / Paramedic (sends 6-digit OTP to email)
 */
export async function registerDriverAction(
  payload: IRegisterDriverPayload
): Promise<ApiResponse<{ email: string; expiresIn: string }>> {
  return apiPost("/auth/register-driver", payload);
}

/**
 * 3. Verify OTP (Activates Patient or Driver account and sets session cookies)
 */
export async function verifyOtpAction(
  payload: IVerifyOtpPayload
): Promise<ApiResponse<IAuthData>> {
  const res = await apiPost<ApiResponse<IAuthData>>("/auth/verify-otp", payload);

  if (res.success && res.data?.accessToken) {
    await setAuthCookies(res.data.accessToken, res.data.refreshToken);
  }

  return res;
}

/**
 * 4. Resend OTP to email
 */
export async function resendOtpAction(
  payload: IResendOtpPayload
): Promise<ApiResponse<{ email: string; message: string; expiresIn: string }>> {
  return apiPost("/auth/resend-otp", payload);
}

/**
 * 5. Forgot Password (generates reset OTP)
 */
export async function forgotPasswordAction(
  payload: IForgotPasswordPayload
): Promise<ApiResponse<{ email: string; message: string; expiresIn: string }>> {
  return apiPost("/auth/forgot-password", payload);
}

/**
 * 6. Reset Password (verifies OTP and sets new password)
 */
export async function resetPasswordAction(
  payload: IResetPasswordPayload
): Promise<ApiResponse<null>> {
  return apiPost("/auth/reset-password", payload);
}

/**
 * 7. Dynamic universal login (Patient, Driver, Super Admin)
 */
export async function loginUserAction(
  payload: ILoginUserPayload
): Promise<ApiResponse<IAuthData>> {
  const res = await apiPost<ApiResponse<IAuthData>>("/auth/login", payload);

  if (res.success && res.data?.accessToken) {
    await setAuthCookies(res.data.accessToken, res.data.refreshToken);
  }

  return res;
}

/**
 * 8. Google Sign-In / Login
 */
export async function googleLoginAction(
  payload: IGoogleLoginPayload
): Promise<ApiResponse<IAuthData>> {
  const res = await apiPost<ApiResponse<IAuthData>>("/auth/google-login", payload);

  if (res.success && res.data?.accessToken) {
    await setAuthCookies(res.data.accessToken, res.data.refreshToken);
  }

  return res;
}

/**
 * 9. Get current user profile (/auth/me)
 */
export async function getCurrentUserAction(): Promise<ApiResponse<IMeResponseData>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return {
      success: false,
      statusCode: 401,
      message: "No active session",
    };
  }

  return apiGet<ApiResponse<IMeResponseData>>("/auth/me");
}

/**
 * 10. Change Password (protected)
 */
export async function changePasswordAction(
  payload: IChangePasswordPayload
): Promise<ApiResponse<null>> {
  return apiPost("/auth/change-password", payload);
}

/**
 * 11. Refresh Token
 */
export async function refreshTokenAction(): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("refreshToken")?.value;

  if (!token) {
    return {
      success: false,
      statusCode: 401,
      message: "No refresh token found",
    };
  }

  const res = await apiPost<ApiResponse<{ accessToken: string; refreshToken: string }>>(
    "/auth/refresh-token",
    { refreshToken: token }
  );

  if (res.success && res.data?.accessToken) {
    await setAuthCookies(res.data.accessToken, res.data.refreshToken);
  }

  return res;
}

/**
 * 12. Logout
 */
export async function logoutAction(): Promise<ApiResponse<null>> {
  try {
    await apiPost("/auth/logout");
  } catch (error) {
    console.error("Backend logout error:", error);
  } finally {
    await removeAuthCookies();
  }

  return {
    success: true,
    message: "Logged out successfully",
  };
}

/**
 * Helper to get the current access token for client components (e.g. Socket.io, Leaflet tracker)
 */
export async function getAccessTokenAction(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
}
