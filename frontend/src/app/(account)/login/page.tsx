"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  requestOtp,
} from "@/features/auth/api";

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const normalizedPhone =
      phone.trim();

    if (!normalizedPhone) {
      setError(
        "لطفاً شماره موبایل را وارد کنید."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response =
        await requestOtp(
          normalizedPhone
        );

      sessionStorage.setItem(
        "matcha_otp_id",
        response.data.otpId
      );

      sessionStorage.setItem(
        "matcha_phone",
        response.data.phone
      );

      sessionStorage.setItem(
        "matcha_otp_expires_at",
        response.data.expiresAt
      );

      router.push(
        "/verify-otp"
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "ارسال کد تأیید ناموفق بود."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <h1>
          ورود به حساب
        </h1>

        <p>
          شماره موبایل خود را وارد کنید.
        </p>

        <form
          onSubmit={handleSubmit}
        >
          <input
            type="tel"
            inputMode="numeric"
            dir="ltr"
            autoComplete="tel"
            placeholder="09121234567"
            value={phone}
            onChange={(event) =>
              setPhone(
                event.target.value
              )
            }
            disabled={isLoading}
          />

          {error && (
            <p
              style={{
                color: "red",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "در حال ارسال..."
              : "دریافت کد تأیید"}
          </button>
        </form>
      </div>
    </main>
  );
}