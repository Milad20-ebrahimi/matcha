"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  completeRegistration,
} from "@/features/auth/api";

import {
  useAuth,
} from "@/features/auth/hooks";

export default function RegisterPage() {
  const router = useRouter();

  const {
    setSession,
  } = useAuth();

  const [otpId, setOtpId] =
    useState<string | null>(null);

  const [phone, setPhone] =
    useState<string | null>(null);

  const [firstName, setFirstName] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const savedOtpId =
      sessionStorage.getItem(
        "matcha_otp_id"
      );

    const savedPhone =
      sessionStorage.getItem(
        "matcha_phone"
      );

    if (!savedOtpId || !savedPhone) {
      router.replace("/login");
      return;
    }

    setOtpId(savedOtpId);
    setPhone(savedPhone);
  }, [router]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const normalizedName =
      firstName.trim();

    if (!normalizedName) {
      setError(
        "لطفاً نام خود را وارد کنید."
      );
      return;
    }

    if (!otpId) {
      setError(
        "اطلاعات تأیید شماره پیدا نشد."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response =
        await completeRegistration(
          otpId,
          normalizedName
        );

      await setSession({
        accessToken:
          response.data.accessToken,

        refreshToken:
          response.data.refreshToken,
      });

      sessionStorage.removeItem(
        "matcha_otp_id"
      );

      sessionStorage.removeItem(
        "matcha_phone"
      );

      sessionStorage.removeItem(
        "matcha_otp_expires_at"
      );

    router.replace("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "ثبت‌نام ناموفق بود."
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
          تکمیل ثبت‌نام
        </h1>

        <p>
          برای ساخت حساب، نام خود را وارد کنید.
        </p>

        {phone && (
          <p dir="ltr">
            {phone}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="نام"
            value={firstName}
            onChange={(event) =>
              setFirstName(
                event.target.value
              )
            }
            disabled={isLoading}
            autoComplete="given-name"
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
            disabled={
              isLoading ||
              !firstName.trim()
            }
          >
            {isLoading
              ? "در حال ثبت‌نام..."
              : "تکمیل ثبت‌نام"}
          </button>
        </form>
      </div>
    </main>
  );
}