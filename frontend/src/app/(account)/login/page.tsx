
"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  requestOtp,
  verifyOtp,
} from "@/features/auth/api";

import {
  useAuthContext,
} from "@/features/auth/auth.context";

type LoginMode = "phone";

export default function LoginPage() {
  const router = useRouter();

  const {
    setSession,
  } = useAuthContext();

  const [mode] =
    useState<LoginMode>("phone");

  // ==========================================
  // PHONE
  // ==========================================

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    otp,
    setOtp,
  ] = useState("");

  const [
    otpId,
    setOtpId,
  ] = useState("");

  const [
    otpSent,
    setOtpSent,
  ] = useState(false);

  // ==========================================
  // COMMON
  // ==========================================

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  // ==========================================
  // REQUEST OTP
  // ==========================================

  async function handleRequestOtp() {
    setError(null);

    const normalizedPhone =
      phone.trim();

    if (!normalizedPhone) {
      setError(
        "شماره موبایل را وارد کنید.",
      );

      return;
    }

    if (
      !/^09\d{9}$/.test(
        normalizedPhone,
      )
    ) {
      setError(
        "شماره موبایل معتبر نیست.",
      );

      return;
    }

    try {
      setIsLoading(true);

      const response =
        await requestOtp(
          normalizedPhone,
        );

      console.log(
        "Request OTP response:",
        response,
      );

      setOtpId(
        response.data.otpId,
      );

      setOtpSent(true);

      setOtp("");

    } catch (error) {
      console.error(
        "Request OTP error:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "ارسال کد تأیید ناموفق بود.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ==========================================
  // VERIFY OTP
  // ==========================================

  async function handleVerifyOtp(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    const normalizedOtp =
      otp.trim();

    if (!normalizedOtp) {
      setError(
        "کد تأیید را وارد کنید.",
      );

      return;
    }

    if (
      !/^\d{6}$/.test(
        normalizedOtp,
      )
    ) {
      setError(
        "کد تأیید باید ۶ رقم باشد.",
      );

      return;
    }

    if (!otpId) {
      setError(
        "شناسه کد تأیید پیدا نشد. دوباره درخواست کد کنید.",
      );

      return;
    }

    try {
      setIsLoading(true);

      const response =
        await verifyOtp(
          otpId,
          normalizedOtp,
        );

      console.log(
        "Verify OTP response:",
        response,
      );

      const {
        accessToken,
        refreshToken,
        isNewUser,
        needsName,
      } = response.data;

      // ========================================
      // NEW USER
      // ========================================

      if (
        isNewUser &&
        needsName
      ) {
        sessionStorage.setItem(
          "matcha_pending_otp_id",
          otpId,
        );

sessionStorage.setItem(
  "matcha_pending_phone",
  phone.trim(),
);

        router.push(
          "/register/complete",
        );

        return;
      }

      // ========================================
      // EXISTING USER
      // ========================================

      if (
        !accessToken ||
        !refreshToken
      ) {
        throw new Error(
          "توکن ورود از سرور دریافت نشد.",
        );
      }

      await setSession({
        accessToken,
        refreshToken,
      });

      router.push("/");

    } catch (error) {
      console.error(
        "Verify OTP error:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "کد تأیید نامعتبر است.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ==========================================
  // CHANGE PHONE
  // ==========================================

  function handleChangePhone() {
    setOtpSent(false);
    setOtp("");
    setOtpId("");
    setError(null);
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8"
    >
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

        {/* ======================================
            BRAND
        ====================================== */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-2xl font-bold text-white">
            M
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            ورود به Matcha Cafe
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            برای ورود شماره موبایل خود را وارد کنید
          </p>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600"
          >
            {error}
          </div>
        )}

        {/* ======================================
            PHONE
        ====================================== */}

        {mode === "phone" && (
          <div className="space-y-5">

            {/* ==================================
                PHONE INPUT
            ================================== */}

            {!otpSent && (
              <>
                <div>

                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    شماره موبایل
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => {
                      const value =
                        event.target.value.replace(
                          /\D/g,
                          "",
                        );

                      setPhone(value);
                      setError(null);
                    }}
                    placeholder="09123456789"
                    autoComplete="tel"
                    inputMode="numeric"
                    dir="ltr"
                    maxLength={11}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />

                </div>

                <button
                  type="button"
                  onClick={
                    handleRequestOtp
                  }
                  disabled={
                    isLoading
                  }
                  className="w-full rounded-xl bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading
                    ? "در حال ارسال..."
                    : "دریافت کد تأیید"}
                </button>
              </>
            )}

            {/* ==================================
                OTP
            ================================== */}

            {otpSent && (
              <form
                onSubmit={
                  handleVerifyOtp
                }
                className="space-y-5"
              >

                <div className="text-center">

                  <p className="text-sm text-gray-500">
                    کد تأیید به شماره زیر ارسال شد
                  </p>

                  <p
                    dir="ltr"
                    className="mt-2 font-medium text-gray-900"
                  >
                    {phone}
                  </p>

                </div>

                {/* OTP INPUT */}

                <div>

                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    کد تأیید
                  </label>

                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) => {
                      const value =
                        event.target.value.replace(
                          /\D/g,
                          "",
                        );

                      setOtp(value);
                      setError(null);
                    }}
                    placeholder="123456"
                    autoComplete="one-time-code"
                    dir="ltr"
                    autoFocus
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-xl font-medium tracking-[0.5em] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />

                </div>

                {/* VERIFY BUTTON */}

                <button
                  type="submit"
                  disabled={
                    isLoading
                  }
                  className="w-full rounded-xl bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading
                    ? "در حال بررسی..."
                    : "تأیید و ورود"}
                </button>

                {/* CHANGE PHONE */}

                <button
                  type="button"
                  onClick={
                    handleChangePhone
                  }
                  disabled={
                    isLoading
                  }
                  className="w-full text-sm text-gray-500 transition hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  تغییر شماره موبایل
                </button>

              </form>
            )}

          </div>
        )}

        {/* ======================================
            REGISTER
        ====================================== */}

        <div className="mt-7 text-center text-sm text-gray-500">

          حساب کاربری ندارید؟

          <a
            href="/register"
            className="mr-1 font-medium text-green-700 transition hover:text-green-800"
          >
            ثبت‌نام کنید
          </a>

        </div>

        {/* ======================================
            FOOTER
        ====================================== */}

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          با ورود به حساب کاربری، شرایط استفاده از سرویس را می‌پذیرید.
        </p>

      </div>
    </main>
  );
}
