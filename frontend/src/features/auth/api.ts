import {
  apiRequest,
} from "@/lib/api/client";

import type {
  RequestOtpResponse,
  VerifyOtpResponse,
  CompleteRegistrationResponse,
  GetMeResponse,
  RefreshResponse,
  LogoutResponse,
  RegisterWithEmailResponse,
  LoginWithEmailResponse,
} from "./types";

export async function requestOtp(
  phone: string
) {
  return apiRequest<RequestOtpResponse>(
    "/auth/request-otp",
    {
      method: "POST",
      body: JSON.stringify({
        phone,
      }),
    }
  );
}

export async function verifyOtp(
  otpId: string,
  code: string
) {
  return apiRequest<VerifyOtpResponse>(
    "/auth/verify-otp",
    {
      method: "POST",
      body: JSON.stringify({
        otpId,
        code,
      }),
    }
  );
}

export async function completeRegistration(
  otpId: string,
  firstName: string
) {
  return apiRequest<CompleteRegistrationResponse>(
    "/auth/complete-registration",
    {
      method: "POST",
      body: JSON.stringify({
        otpId,
        firstName,
      }),
    }
  );
}

export async function getMe(
  accessToken: string
) {
  return apiRequest<GetMeResponse>(
    "/users/me",
    {
      method: "GET",
      headers: {
        Authorization:
          `Bearer ${accessToken}`,
      },
    }
  );
}

export async function refreshToken(
  refreshTokenValue: string
) {
  return apiRequest<RefreshResponse>(
    "/auth/refresh",
    {
      method: "POST",
      body: JSON.stringify({
        refreshToken:
          refreshTokenValue,
      }),
    }
  );
}

export async function logout(
  refreshTokenValue: string
) {
  return apiRequest<LogoutResponse>(
    "/auth/logout",
    {
      method: "POST",
      body: JSON.stringify({
        refreshToken:
          refreshTokenValue,
      }),
    }
  );
}
export async function requestRegistrationOtp(
  phone: string
) {
  return apiRequest<RequestOtpResponse>(
    "/auth/request-registration-otp",
    {
      method: "POST",
      body: JSON.stringify({
        phone,
      }),
    }
  );
}
export async function registerWithEmail(
  email: string,
  password: string,
  firstName: string
) {
  return apiRequest<RegisterWithEmailResponse>(
    "/auth/register-email",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        firstName,
      }),
    }
  );
}

export async function loginWithEmail(
  email: string,
  password: string
) {
  return apiRequest<LoginWithEmailResponse>(
    "/auth/login-email",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );
}