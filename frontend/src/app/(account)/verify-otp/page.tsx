"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  verifyOtp,
} from "@/features/auth/api";

import {
  useAuth,
} from "@/features/auth/hooks";

export default function VerifyOtpPage() {
  const router = useRouter();

  const {
    setSession,
  } = useAuth();

  const [otpId, setOtpId] =
    useState<string | null>(null);

  const [phone, setPhone] =
    useState<string | null>(null);

  const [code, setCode] =
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

    if (!otpId) {
      setError(
        "کد تأیید پیدا نشد."
      );
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError(
        "کد تأیید باید ۶ رقم باشد."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response =
        await verifyOtp(
          otpId,
          code
        );



      const {
        isNewUser,
        needsName,
        accessToken,
        refreshToken,
      } = response.data;

      /*
       * کاربر قدیمی
       */
      if (
        !isNewUser &&
        accessToken &&
        refreshToken
      ) {
        await setSession({
          accessToken,
          refreshToken,
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

        return;
      }

      /*
       * کاربر جدید
       */
      if (
        isNewUser &&
        needsName
      ) {
        router.push(
          "/register"
        );

        return;
      }

      setError(
        "وضعیت ورود نامعتبر است."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "تأیید کد ناموفق بود."
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
          تأیید شماره موبایل
        </h1>

        <p>
          کد ارسال‌شده به{" "}
          <strong dir="ltr">
            {phone}
          </strong>{" "}
          را وارد کنید.
        </p>

        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            inputMode="numeric"
            dir="ltr"
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="------"
            value={code}
            onChange={(event) =>
              setCode(
                event.target.value.replace(
                  /\D/g,
                  ""
                )
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
            disabled={
              isLoading ||
              code.length !== 6
            }
          >
            {isLoading
              ? "در حال بررسی..."
              : "تأیید کد"}
          </button>
        </form>
      </div>
    </main>
  );
}