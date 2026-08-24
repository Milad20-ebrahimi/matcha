"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  requestOtp,
  verifyOtp,
  loginWithEmail,
} from "@/features/auth/api";

import {
  useAuthContext,
} from "@/features/auth/auth.context";

type LoginMode = "phone" | "email";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    setSession,
  } = useAuthContext();

  const [mode, setMode] =
    useState<LoginMode>(() => {
      return searchParams.get("mode") === "email"
        ? "email"
        : "phone";
    });

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
  // REQUEST PHONE OTP
  // ==========================================

  async function handleRequestOtp() {
    setError(null);

    const normalizedPhone =
      phone.trim();

    if (!normalizedPhone) {
      setError(
        "لطفاً شماره موبایل را وارد کنید."
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
        await requestOtp(
          normalizedPhone
        );

      setOtpId(
        response.data.otpId
      );

      setPhone(
        response.data.phone
      );

      setOtp("");

      setOtpSent(true);
    } catch (error) {
      console.error(
        "Request OTP error:",
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
  // VERIFY PHONE OTP
  // ==========================================

  async function handleVerifyOtp(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    const normalizedOtp =
      otp.trim();

    if (!normalizedOtp) {
      setError(
        "لطفاً کد تأیید را وارد کنید."
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

    if (!otpId) {
      setError(
        "شناسه کد تأیید پیدا نشد. دوباره درخواست کد کنید."
      );

      return;
    }

    try {
      setIsLoading(true);

      const response =
        await verifyOtp(
          otpId,
          normalizedOtp
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
          otpId
        );

        sessionStorage.setItem(
          "matcha_pending_phone",
          phone.trim()
        );

        router.push(
          "/register?mode=phone"
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
          "توکن ورود از سرور دریافت نشد."
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

  // ==========================================
  // EMAIL LOGIN
  // ==========================================

  async function handleEmailLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError(
        "لطفاً ایمیل را وارد کنید."
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

    if (!password) {
      setError(
        "لطفاً رمز عبور را وارد کنید."
      );

      return;
    }

    try {
      setIsLoading(true);

      const response =
        await loginWithEmail(
          normalizedEmail,
          password
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
          "توکن ورود از سرور دریافت نشد."
        );
      }

      await setSession({
        accessToken,
        refreshToken,
      });

      router.push("/");
    } catch (error) {
      console.error(
        "Email login error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "ایمیل یا رمز عبور اشتباه است."
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
  // CHANGE MODE
  // ==========================================

  function handleChangeMode(
    nextMode: LoginMode
  ) {
    setMode(nextMode);

    setError(null);

    if (
      nextMode === "phone"
    ) {
      setPassword("");
    }

    if (
      nextMode === "email"
    ) {
      setOtpSent(false);
      setOtp("");
      setOtpId("");
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
            ورود به Matcha Cafe
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            برای ورود به حساب کاربری خود یکی از روش‌های زیر را انتخاب کنید.
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
            ورود با موبایل
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
            ورود با ایمیل
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
            PHONE LOGIN
        ====================================== */}

        {mode === "phone" && (
          <div className="space-y-5">

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
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
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

            {otpSent && (
              <form
                onSubmit={
                  handleVerifyOtp
                }
                className="space-y-5"
              >

                <div className="text-center">

                  <p className="text-sm text-gray-500">
                    کد تأیید به شماره زیر ارسال شد:
                  </p>

                  <p
                    dir="ltr"
                    className="mt-2 font-medium text-gray-900"
                  >
                    {phone}
                  </p>

                </div>

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
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-xl font-medium tracking-[0.5em] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
                  />

                </div>

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    otp.length !== 6
                  }
                  className="w-full rounded-xl bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading
                    ? "در حال بررسی..."
                    : "تأیید و ورود"}
                </button>

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

          </div>
        )}

        {/* ======================================
            EMAIL LOGIN
        ====================================== */}

        {mode === "email" && (
          <form
            onSubmit={
              handleEmailLogin
            }
            className="space-y-5"
          >

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
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
              />

            </div>

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
                placeholder="رمز عبور خود را وارد کنید"
                autoComplete="current-password"
                dir="ltr"
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
              />

            </div>

            <button
              type="submit"
              disabled={
                isLoading
              }
              className="w-full rounded-xl bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "در حال ورود..."
                : "ورود به حساب"}
            </button>

          </form>
        )}

        {/* REGISTER */}

        <div className="mt-7 text-center text-sm text-gray-500">

          حساب کاربری ندارید؟

          <button
            type="button"
            onClick={() =>
              router.push("/register")
            }
            className="mr-1 font-medium text-green-700 transition hover:text-green-800"
          >
            ثبت‌نام کنید
          </button>

        </div>

        {/* FOOTER */}

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          با ورود به حساب کاربری، شرایط استفاده از سرویس را می‌پذیرید.
        </p>

      </div>
    </main>
  );
}

// ==========================================
// PAGE
// ==========================================

export default function LoginPage() {
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
      <LoginPageContent />
    </Suspense>
  );
}