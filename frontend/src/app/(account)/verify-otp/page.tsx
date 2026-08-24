"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  verifyOtp,
  completeRegistration,
} from "@/features/auth/api";

import {
  useAuthContext,
} from "@/features/auth/auth.context";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    setSession,
  } = useAuthContext();

  const mode =
    searchParams.get("mode") === "register"
      ? "register"
      : "login";

  const [
    otpId,
    setOtpId,
  ] = useState<string | null>(null);

  const [
    phone,
    setPhone,
  ] = useState<string | null>(null);

  const [
    firstName,
    setFirstName,
  ] = useState<string | null>(null);

  const [
    code,
    setCode,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const savedOtpId =
      sessionStorage.getItem(
        "matcha_registration_otp_id"
      );

    const savedPhone =
      sessionStorage.getItem(
        "matcha_registration_phone"
      );

    const savedFirstName =
      sessionStorage.getItem(
        "matcha_registration_first_name"
      );

    /*
     * ثبت‌نام با موبایل
     */
    if (mode === "register") {
      if (!savedOtpId || !savedPhone) {
        router.replace(
          "/register?mode=phone"
        );

        return;
      }

      setOtpId(savedOtpId);
      setPhone(savedPhone);
      setFirstName(savedFirstName);

      return;
    }

    /*
     * ورود با موبایل
     *
     * این مقادیر از login/page.tsx
     * در sessionStorage ذخیره می‌شوند.
     */
    const loginOtpId =
      sessionStorage.getItem(
        "matcha_otp_id"
      );

    const loginPhone =
      sessionStorage.getItem(
        "matcha_phone"
      );

    if (!loginOtpId || !loginPhone) {
      router.replace("/login");

      return;
    }

    setOtpId(loginOtpId);
    setPhone(loginPhone);
  }, [mode, router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const normalizedCode =
      code.trim();

    if (!otpId) {
      setError(
        "شناسه کد تأیید پیدا نشد."
      );

      return;
    }

    if (
      !/^\d{6}$/.test(
        normalizedCode
      )
    ) {
      setError(
        "کد تأیید باید ۶ رقم باشد."
      );

      return;
    }

    try {
      setIsLoading(true);

      /*
       * اول OTP را بررسی می‌کنیم
       */
      const response =
        await verifyOtp(
          otpId,
          normalizedCode
        );

      const {
        accessToken,
        refreshToken,
        isNewUser,
        needsName,
      } = response.data;

      /*
       * ========================================
       * ثبت‌نام با موبایل
       * ========================================
       */
      if (mode === "register") {
        /*
         * اگر verifyOtp توکن برگرداند،
         * یعنی کاربر قبلاً وجود داشته است.
         */
        if (
          !isNewUser &&
          accessToken &&
          refreshToken
        ) {
          setError(
            "این شماره موبایل قبلاً ثبت‌نام کرده است. لطفاً وارد حساب خود شوید."
          );

          return;
        }

        /*
         * بعد از تأیید OTP،
         * ثبت‌نام را کامل می‌کنیم.
         */
        const savedFirstName =
          firstName?.trim();

        if (!savedFirstName) {
          setError(
            "نام کاربر پیدا نشد. لطفاً ثبت‌نام را دوباره انجام دهید."
          );

          return;
        }

        const registration =
          await completeRegistration(
            otpId,
            savedFirstName
          );

        const {
          accessToken:
            registrationAccessToken,
          refreshToken:
            registrationRefreshToken,
        } = registration.data;

        if (
          !registrationAccessToken ||
          !registrationRefreshToken
        ) {
          throw new Error(
            "توکن ورود بعد از ثبت‌نام دریافت نشد."
          );
        }

        await setSession({
          accessToken:
            registrationAccessToken,
          refreshToken:
            registrationRefreshToken,
        });

        /*
         * پاک کردن اطلاعات موقت ثبت‌نام
         */
        sessionStorage.removeItem(
          "matcha_registration_otp_id"
        );

        sessionStorage.removeItem(
          "matcha_registration_phone"
        );

        sessionStorage.removeItem(
          "matcha_registration_first_name"
        );

        router.replace("/");

        return;
      }

      /*
       * ========================================
       * ورود با موبایل
       * ========================================
       */

      /*
       * کاربر جدید نباید از صفحه Login
       * مستقیماً وارد حساب شود.
       *
       * در این حالت باید به Register برود.
       */
      if (
        isNewUser &&
        needsName
      ) {
        /*
         * اطلاعات لازم برای ثبت‌نام
         */
        sessionStorage.setItem(
          "matcha_registration_otp_id",
          otpId
        );

        sessionStorage.setItem(
          "matcha_registration_phone",
          phone ?? ""
        );

        router.replace(
          "/register?mode=phone"
        );

        return;
      }

      /*
       * کاربر قدیمی
       */
      if (
        !accessToken ||
        !refreshToken
      ) {
        throw new Error(
          "توکن ورود از سرور دریافت نشد."
        );
      }

      await setSession({
        accessToken,
        refreshToken,
      });

      /*
       * پاک کردن اطلاعات OTP ورود
       */
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
      console.error(
        "Verify OTP error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "کد تأیید نامعتبر است."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleBack() {
    if (mode === "register") {
      router.push(
        "/register?mode=phone"
      );

      return;
    }

    router.push("/login");
  }

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8"
    >
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

        {/* BRAND */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-2xl font-bold text-white">
            M
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            تأیید شماره موبایل
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            کد تأیید ارسال‌شده به شماره زیر را وارد کنید.
          </p>

          {phone && (
            <p
              dir="ltr"
              className="mt-3 text-base font-semibold text-gray-900"
            >
              {phone}
            </p>
          )}

        </div>

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600"
          >
            {error}
          </div>
        )}

        {/* OTP FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

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
              autoComplete="one-time-code"
              autoFocus
              dir="ltr"
              value={code}
              onChange={(event) => {
                const value =
                  event.target.value.replace(
                    /\D/g,
                    ""
                  );

                setCode(value);
                setError("");
              }}
              placeholder="123456"
              disabled={isLoading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-xl font-medium tracking-[0.5em] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-50"
            />

          </div>

          <button
            type="submit"
            disabled={
              isLoading ||
              code.length !== 6
            }
            className="w-full rounded-xl bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "در حال بررسی..."
              : mode === "register"
                ? "تأیید و تکمیل ثبت‌نام"
                : "تأیید و ورود"}
          </button>

          <button
            type="button"
            onClick={handleBack}
            disabled={isLoading}
            className="w-full text-sm text-gray-500 transition hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            بازگشت
          </button>

        </form>

      </div>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <main
          dir="rtl"
          className="flex min-h-screen items-center justify-center bg-gray-50 px-4"
        >
          <div className="text-sm text-gray-500">
            در حال بارگذاری...
          </div>
        </main>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
