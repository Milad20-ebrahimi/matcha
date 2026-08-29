
"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  loginWithEmail,
  requestOtp,
} from "@/features/auth/api";

import {
  useAuth,
} from "@/features/auth/hooks";

type LoginMode = "phone" | "email";

export default function LoginForm() {
  const router = useRouter();

  const { setSession } = useAuth();

  const [mode, setMode] =
    useState<LoginMode>("email");

  // Phone
  const [phone, setPhone] =
    useState("");

  // Email
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  // Common
  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ==========================================
  // EMAIL LOGIN
  // ==========================================

  async function handleEmailLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

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
      setLoading(true);

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

      router.replace("/");
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
      setLoading(false);
    }
  }

  // ==========================================
  // REQUEST PHONE OTP
  // ==========================================

  async function handleRequestOtp() {
    setError("");

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
      setLoading(true);

      /*
       * پاک کردن اطلاعات OTP قبلی
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

      /*
       * درخواست OTP
       */
      const response =
        await requestOtp(
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

      /*
       * ذخیره اطلاعات برای صفحه Verify OTP
       */
      sessionStorage.setItem(
        "matcha_otp_id",
        otpId
      );

      sessionStorage.setItem(
        "matcha_phone",
        returnedPhone ||
          normalizedPhone
      );

      /*
       * انتقال به صفحه اختصاصی OTP
       */
      router.push(
        "/verify-otp?mode=login"
      );
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
      setLoading(false);
    }
  }

  // ==========================================
  // CHANGE LOGIN MODE
  // ==========================================

  function handleChangeMode(
    nextMode: LoginMode
  ) {
    setMode(nextMode);

    setError("");

    if (
      nextMode === "phone"
    ) {
      setEmail("");
      setPassword("");
    } else {
      setPhone("");

      /*
       * پاک کردن OTP های قبلی
       * در صورت برگشت به حالت ایمیل
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
    }
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      className="
        mx-auto
        max-w-md
        rounded-[40px]
        border
        border-[#b9d19a]/40
        bg-white/70
        p-8
        shadow-[0_30px_80px_-40px_rgba(13,26,18,0.35)]
        backdrop-blur-xl
        sm:p-10
      "
    >
      {/* BRAND */}

      <div className="text-center">
        <p
          className="
            text-xs
            tracking-[0.3em]
            text-[#355e3b]
          "
        >
          ACCOUNT
        </p>

        <h2
          className="
            mt-4
            text-2xl
            font-light
            text-[#0d1a12]
          "
        >
          ورود به حساب
        </h2>
      </div>

      {/* MODE SWITCH */}

      <div
        className="
          mt-8
          grid
          grid-cols-2
          rounded-full
          bg-[#f2eee4]
          p-1
        "
      >
        <button
          type="button"
          onClick={() =>
            handleChangeMode("email")
          }
          disabled={loading}
          className={`
            rounded-full
            px-4
            py-3
            text-sm
            transition-all
            duration-300
            ${
              mode === "email"
                ? "bg-white text-[#355e3b] shadow-sm"
                : "text-[#0d1a12]/50 hover:text-[#0d1a12]"
            }
          `}
        >
          ورود با ایمیل
        </button>

        <button
          type="button"
          onClick={() =>
            handleChangeMode("phone")
          }
          disabled={loading}
          className={`
            rounded-full
            px-4
            py-3
            text-sm
            transition-all
            duration-300
            ${
              mode === "phone"
                ? "bg-white text-[#355e3b] shadow-sm"
                : "text-[#0d1a12]/50 hover:text-[#0d1a12]"
            }
          `}
        >
          ورود با موبایل
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div
          role="alert"
          className="
            mt-6
            rounded-2xl
            border
            border-red-100
            bg-red-50
            px-4
            py-3
            text-center
            text-sm
            leading-6
            text-red-600
          "
        >
          {error}
        </div>
      )}

      {/* ========================================
          EMAIL
          ======================================== */}

      {mode === "email" && (
        <form
          onSubmit={
            handleEmailLogin
          }
          className="
            mt-8
            space-y-5
          "
        >
          {/* EMAIL */}

          <div>
            <label
              htmlFor="login-email"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-[#0d1a12]/75
              "
            >
              ایمیل
            </label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(
                  event.target.value
                );
                setError("");
              }}
              placeholder="example@email.com"
              autoComplete="email"
              dir="ltr"
              disabled={loading}
              className="
                w-full
                rounded-2xl
                border
                border-[#0d1a12]/10
                bg-white/80
                px-5
                py-4
                text-left
                text-sm
                text-[#0d1a12]
                outline-none
                transition
                placeholder:text-[#0d1a12]/30
                focus:border-[#b9d19a]
                focus:ring-4
                focus:ring-[#b9d19a]/20
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label
              htmlFor="login-password"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-[#0d1a12]/75
              "
            >
              رمز عبور
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(
                  event.target.value
                );
                setError("");
              }}
              placeholder="رمز عبور"
              autoComplete="current-password"
              dir="ltr"
              disabled={loading}
              className="
                w-full
                rounded-2xl
                border
                border-[#0d1a12]/10
                bg-white/80
                px-5
                py-4
                text-left
                text-sm
                text-[#0d1a12]
                outline-none
                transition
                placeholder:text-[#0d1a12]/30
                focus:border-[#b9d19a]
                focus:ring-4
                focus:ring-[#b9d19a]/20
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="
              mt-4
              w-full
              rounded-full
              bg-[#0d1a12]
              py-4
              text-sm
              font-medium
              text-[#f2e9d8]
              transition-all
              duration-500
              hover:bg-[#355e3b]
              hover:shadow-[0_15px_35px_-15px_rgba(13,26,18,0.5)]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading
              ? "در حال ورود..."
              : "ورود"}
          </button>
        </form>
      )}

      {/* ========================================
          PHONE
          ======================================== */}

      {mode === "phone" && (
        <div className="mt-8">
          <div className="space-y-5">
            {/* PHONE */}

            <div>
              <label
                htmlFor="login-phone"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#0d1a12]/75
                "
              >
                شماره موبایل
              </label>

              <input
                id="login-phone"
                type="tel"
                value={phone}
                onChange={(event) => {
                  const value =
                    event.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setPhone(value);
                  setError("");
                }}
                placeholder="09123456789"
                autoComplete="tel"
                inputMode="numeric"
                dir="ltr"
                maxLength={11}
                disabled={loading}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#0d1a12]/10
                  bg-white/80
                  px-5
                  py-4
                  text-left
                  text-sm
                  text-[#0d1a12]
                  outline-none
                  transition
                  placeholder:text-[#0d1a12]/30
                  focus:border-[#b9d19a]
                  focus:ring-4
                  focus:ring-[#b9d19a]/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            {/* SEND OTP */}

            <button
              type="button"
              onClick={
                handleRequestOtp
              }
              disabled={loading}
              className="
                mt-4
                w-full
                rounded-full
                bg-[#0d1a12]
                py-4
                text-sm
                font-medium
                text-[#f2e9d8]
                transition-all
                duration-500
                hover:bg-[#355e3b]
                hover:shadow-[0_15px_35px_-15px_rgba(13,26,18,0.5)]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "در حال ارسال..."
                : "دریافت کد تأیید"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
