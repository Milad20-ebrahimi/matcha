"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  requestRegistrationOtp,
  verifyOtp,
  completeRegistration,
} from "@/features/auth/api";

import {
  useAuthContext,
} from "@/features/auth/auth.context";

type RegisterStep =
  | "details"
  | "otp";

export default function RegisterPage() {
  const router = useRouter();

  const {
    setSession,
  } = useAuthContext();

  const [
    step,
    setStep,
  ] = useState<RegisterStep>(
    "details"
  );

  const [
    firstName,
    setFirstName,
  ] = useState("");

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
  ] = useState<string | null>(
    null
  );

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  // ==========================================
  // REQUEST OTP
  // ==========================================

  async function handleRequestOtp(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    const normalizedName =
      firstName.trim();

    const normalizedPhone =
      phone.trim();

    if (!normalizedName) {
      setError(
        "لطفاً نام خود را وارد کنید."
      );

      return;
    }

    if (
      normalizedName.length < 2
    ) {
      setError(
        "نام باید حداقل ۲ کاراکتر باشد."
      );

      return;
    }

    if (!normalizedPhone) {
      setError(
        "لطفاً شماره موبایل خود را وارد کنید."
      );

      return;
    }

    if (
      !/^09\d{9}$/.test(
        normalizedPhone
      )
    ) {
      setError(
        "شماره موبایل معتبر نیست."
      );

      return;
    }

    try {
      setIsLoading(true);

     const response =
  await requestRegistrationOtp(
    normalizedPhone
  );

      setOtpId(
        response.data.otpId
      );

      setPhone(
        response.data.phone
      );

      setOtp("");

      setStep("otp");
    } catch (error) {
      console.error(
        "Register request OTP error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "ارسال کد تأیید ناموفق بود."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ==========================================
  // VERIFY OTP + COMPLETE REGISTRATION
  // ==========================================

  async function handleVerifyOtp(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    const normalizedOtp =
      otp.trim();

    const normalizedName =
      firstName.trim();

    if (!otpId) {
      setError(
        "شناسه کد تأیید پیدا نشد. دوباره درخواست کد کنید."
      );

      return;
    }

    if (
      !/^\d{6}$/.test(
        normalizedOtp
      )
    ) {
      setError(
        "کد تأیید باید ۶ رقم باشد."
      );

      return;
    }

    if (!normalizedName) {
      setError(
        "نام کاربر الزامی است."
      );

      return;
    }

    try {
      setIsLoading(true);

      // ----------------------------------------
      // STEP 1: VERIFY OTP
      // ----------------------------------------

      const verifyResponse =
        await verifyOtp(
          otpId,
          normalizedOtp
        );

      const {
        isNewUser,
        needsName,
        accessToken,
        refreshToken,
      } = verifyResponse.data;

      /*
       * اگر به هر دلیلی شماره متعلق به
       * یک کاربر موجود باشد، ثبت‌نام را
       * ادامه نمی‌دهیم.
       */
      if (
        !isNewUser &&
        accessToken &&
        refreshToken
      ) {
        setError(
          "این شماره موبایل قبلاً ثبت‌نام کرده است. لطفاً از صفحه ورود وارد شوید."
        );

        return;
      }

      if (
        !isNewUser ||
        !needsName
      ) {
        setError(
          "وضعیت ثبت‌نام معتبر نیست."
        );

        return;
      }

      // ----------------------------------------
      // STEP 2: COMPLETE REGISTRATION
      // ----------------------------------------

      const registrationResponse =
        await completeRegistration(
          otpId,
          normalizedName
        );

      const {
        accessToken:
          registrationAccessToken,
        refreshToken:
          registrationRefreshToken,
      } =
        registrationResponse.data;

      if (
        !registrationAccessToken ||
        !registrationRefreshToken
      ) {
        throw new Error(
          "توکن ورود بعد از ثبت‌نام دریافت نشد."
        );
      }

      // ----------------------------------------
      // STEP 3: SAVE SESSION
      // ----------------------------------------

      await setSession({
        accessToken:
          registrationAccessToken,

        refreshToken:
          registrationRefreshToken,
      });

      // ----------------------------------------
      // CLEANUP
      // ----------------------------------------

      sessionStorage.removeItem(
        "matcha_pending_otp_id"
      );

      sessionStorage.removeItem(
        "matcha_pending_phone"
      );

      sessionStorage.removeItem(
        "matcha_otp_id"
      );

      sessionStorage.removeItem(
        "matcha_phone"
      );

      sessionStorage.removeItem(
        "matcha_otp_expires_at"
      );

      // ----------------------------------------
      // REDIRECT
      // ----------------------------------------

      router.replace("/");
    } catch (error) {
      console.error(
        "Register verification error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "ثبت‌نام ناموفق بود."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ==========================================
  // CHANGE PHONE
  // ==========================================

  function handleChangePhone() {
    setStep("details");

    setOtp("");

    setOtpId(null);

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
            ثبت‌نام در Matcha Cafe
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            برای ساخت حساب کاربری اطلاعات خود را وارد کنید.
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
            STEP 1
        ====================================== */}

        {step === "details" && (
          <form
            onSubmit={
              handleRequestOtp
            }
            className="space-y-5"
          >

            {/* NAME */}

            <div>

              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                نام
              </label>

              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(
                  event
                ) => {
                  setFirstName(
                    event.target.value
                  );

                  setError(null);
                }}
                placeholder="میلاد"
                autoComplete="given-name"
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>

            {/* PHONE */}

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
                onChange={(
                  event
                ) => {
                  const value =
                    event.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setPhone(value);

                  setError(null);
                }}
                placeholder="09123456789"
                autoComplete="tel"
                inputMode="numeric"
                dir="ltr"
                maxLength={11}
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>

            {/* REQUEST OTP */}

            <button
              type="submit"
              disabled={
                isLoading
              }
              className="w-full rounded-xl bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "در حال ارسال کد..."
                : "دریافت کد تأیید"}
            </button>

          </form>
        )}

        {/* ======================================
            STEP 2
        ====================================== */}

        {step === "otp" && (
          <form
            onSubmit={
              handleVerifyOtp
            }
            className="space-y-5"
          >

            <div className="text-center">

              <p className="text-sm leading-6 text-gray-500">
                کد تأیید به شماره زیر ارسال شد:
              </p>

              <p
                dir="ltr"
                className="mt-2 font-medium text-gray-900"
              >
                {phone}
              </p>

            </div>

            {/* OTP */}

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
                onChange={(
                  event
                ) => {
                  const value =
                    event.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setOtp(value);

                  setError(null);
                }}
                placeholder="123456"
                autoComplete="one-time-code"
                dir="ltr"
                autoFocus
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-xl font-medium tracking-[0.5em] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>

            {/* VERIFY */}

            <button
              type="submit"
              disabled={
                isLoading ||
                otp.length !== 6
              }
              className="w-full rounded-xl bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "در حال ثبت‌نام..."
                : "تأیید و تکمیل ثبت‌نام"}
            </button>

            {/* CHANGE PHONE */}

            <button
              type="button"
              onClick={
                handleChangePhone
              }
              disabled={isLoading}
              className="w-full text-sm text-gray-500 transition hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              تغییر شماره موبایل
            </button>

          </form>
        )}

        {/* ======================================
            LOGIN LINK
        ====================================== */}

        <div className="mt-7 text-center text-sm text-gray-500">

          قبلاً حساب کاربری دارید؟

          <button
            type="button"
            onClick={() =>
              router.push("/login")
            }
            className="mr-1 font-medium text-green-700 transition hover:text-green-800"
          >
            وارد شوید
          </button>

        </div>

        {/* FOOTER */}

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          با ثبت‌نام در حساب کاربری، شرایط استفاده از سرویس را می‌پذیرید.
        </p>

      </div>
    </main>
  );
}
