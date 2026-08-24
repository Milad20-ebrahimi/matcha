"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  registerWithEmail,
  requestRegistrationOtp,
} from "@/features/auth/api";

import {
  useAuthContext,
} from "@/features/auth/auth.context";

type RegisterMode = "phone" | "email";

export default function RegisterPage() {
  const router = useRouter();

  const {
    setSession,
  } = useAuthContext();

  const [mode, setMode] =
    useState<RegisterMode>("phone");

  // ==========================================
  // COMMON
  // ==========================================

  const [
    firstName,
    setFirstName,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  // ==========================================
  // PHONE
  // ==========================================

  const [
    phone,
    setPhone,
  ] = useState("");

  // ==========================================
  // EMAIL
  // ==========================================

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  // ==========================================
  // CHANGE MODE
  // ==========================================

  function handleChangeMode(
    nextMode: RegisterMode
  ) {
    setMode(nextMode);
    setError(null);
  }

  // ==========================================
  // PHONE REGISTRATION
  // ==========================================

  async function handlePhoneRegistration(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    const normalizedFirstName =
      firstName.trim();

    const normalizedPhone =
      phone.trim();

    // NAME

    if (!normalizedFirstName) {
      setError(
        "لطفاً نام خود را وارد کنید."
      );

      return;
    }

    if (
      normalizedFirstName.length < 2
    ) {
      setError(
        "نام باید حداقل ۲ کاراکتر باشد."
      );

      return;
    }

    // PHONE

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

      const {
        otpId,
        phone: returnedPhone,
      } = response.data;

      if (!otpId) {
        throw new Error(
          "شناسه کد تأیید از سرور دریافت نشد."
        );
      }

      // SAVE REGISTRATION DATA

      sessionStorage.setItem(
        "matcha_registration_otp_id",
        otpId
      );

      sessionStorage.setItem(
        "matcha_registration_phone",
        returnedPhone ||
          normalizedPhone
      );

      sessionStorage.setItem(
        "matcha_registration_first_name",
        normalizedFirstName
      );

      // GO TO OTP

      router.push(
        "/verify-otp?mode=register"
      );
    } catch (error) {
      console.error(
        "Phone registration error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "ارسال کد ثبت‌نام ناموفق بود."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ==========================================
  // EMAIL REGISTRATION
  // ==========================================

  async function handleEmailRegistration(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    const normalizedFirstName =
      firstName.trim();

    const normalizedEmail =
      email.trim().toLowerCase();

    // NAME

    if (!normalizedFirstName) {
      setError(
        "لطفاً نام خود را وارد کنید."
      );

      return;
    }

    if (
      normalizedFirstName.length < 2
    ) {
      setError(
        "نام باید حداقل ۲ کاراکتر باشد."
      );

      return;
    }

    // EMAIL

    if (!normalizedEmail) {
      setError(
        "لطفاً ایمیل خود را وارد کنید."
      );

      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      setError(
        "فرمت ایمیل صحیح نیست."
      );

      return;
    }

    // PASSWORD

    if (!password) {
      setError(
        "لطفاً رمز عبور خود را وارد کنید."
      );

      return;
    }

    if (password.length < 8) {
      setError(
        "رمز عبور باید حداقل ۸ کاراکتر باشد."
      );

      return;
    }

    // CONFIRM PASSWORD

    if (!confirmPassword) {
      setError(
        "لطفاً تکرار رمز عبور را وارد کنید."
      );

      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "رمز عبور و تکرار آن یکسان نیستند."
      );

      return;
    }

    try {
      setIsLoading(true);

      const response =
        await registerWithEmail(
          normalizedEmail,
          password,
          normalizedFirstName
        );

      const {
        accessToken,
        refreshToken,
      } = response.data;

      if (
        !accessToken ||
        !refreshToken
      ) {
        throw new Error(
          "توکن ورود بعد از ثبت‌نام دریافت نشد."
        );
      }

      await setSession({
        accessToken,
        refreshToken,
      });

      router.replace("/");
    } catch (error) {
      console.error(
        "Email registration error:",
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
  // UI
  // ==========================================

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

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            ثبت‌نام در Matcha Cafe
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            برای ساخت حساب کاربری یکی از روش‌های زیر را انتخاب کنید.
          </p>

        </div>

        {/* MODE SWITCH */}

        <div className="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1">

          <button
            type="button"
            onClick={() =>
              handleChangeMode("phone")
            }
            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              mode === "phone"
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            ثبت‌نام با موبایل
          </button>

          <button
            type="button"
            onClick={() =>
              handleChangeMode("email")
            }
            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              mode === "email"
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            ثبت‌نام با ایمیل
          </button>

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

        {/* ======================================
            PHONE REGISTER
        ====================================== */}

        {mode === "phone" && (
          <form
            onSubmit={
              handlePhoneRegistration
            }
            className="space-y-5"
          >

            {/* NAME */}

            <div>

              <label
                htmlFor="phone-firstName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                نام
              </label>

              <input
                id="phone-firstName"
                type="text"
                value={firstName}
                onChange={(event) => {
                  setFirstName(
                    event.target.value
                  );

                  setError(null);
                }}
                placeholder="میلاد"
                autoComplete="given-name"
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />

            </div>

            {/* PHONE */}

            <div>

              <label
                htmlFor="register-phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                شماره موبایل
              </label>

              <input
                id="register-phone"
                type="tel"
                value={phone}
                onChange={(event) => {
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
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "در حال ارسال کد..."
                : "دریافت کد تأیید"}
            </button>

          </form>
        )}

        {/* ======================================
            EMAIL REGISTER
        ====================================== */}

        {mode === "email" && (
          <form
            onSubmit={
              handleEmailRegistration
            }
            className="space-y-5"
          >

            {/* NAME */}

            <div>

              <label
                htmlFor="email-firstName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                نام
              </label>

              <input
                id="email-firstName"
                type="text"
                value={firstName}
                onChange={(event) => {
                  setFirstName(
                    event.target.value
                  );

                  setError(null);
                }}
                placeholder="میلاد"
                autoComplete="given-name"
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />

            </div>

            {/* EMAIL */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                ایمیل
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(
                    event.target.value
                  );

                  setError(null);
                }}
                placeholder="example@email.com"
                autoComplete="email"
                dir="ltr"
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                رمز عبور
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(
                    event.target.value
                  );

                  setError(null);
                }}
                placeholder="حداقل ۸ کاراکتر"
                autoComplete="new-password"
                dir="ltr"
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                تکرار رمز عبور
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value
                  );

                  setError(null);
                }}
                placeholder="رمز عبور را دوباره وارد کنید"
                autoComplete="new-password"
                dir="ltr"
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />

            </div>

            {/* REGISTER BUTTON */}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "در حال ثبت‌نام..."
                : "ثبت‌نام"}
            </button>

          </form>
        )}

        {/* LOGIN LINK */}

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
