
"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  registerWithEmail,
  requestRegistrationOtp,
} from "@/features/auth/api";

import {
  useAuthContext,
} from "@/features/auth/auth.context";

import Container from "@/components/shared/Container";

type RegisterMode = "phone" | "email";

export default function RegisterPage() {
  const router = useRouter();

  const { setSession } = useAuthContext();

  const [mode, setMode] =
    useState<RegisterMode>("phone");

  const [firstName, setFirstName] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

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

    if (!normalizedFirstName) {
      setError(
        "لطفاً نام خود را وارد کنید."
      );
      return;
    }

    if (normalizedFirstName.length < 2) {
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

    if (!/^09\d{9}$/.test(normalizedPhone)) {
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

    if (!normalizedFirstName) {
      setError(
        "لطفاً نام خود را وارد کنید."
      );
      return;
    }

    if (normalizedFirstName.length < 2) {
      setError(
        "نام باید حداقل ۲ کاراکتر باشد."
      );
      return;
    }

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

    if (!confirmPassword) {
      setError(
        "لطفاً تکرار رمز عبور را وارد کنید."
      );
      return;
    }

    if (password !== confirmPassword) {
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
      className="
        relative
        flex
        min-h-screen
        items-center
        overflow-hidden
        bg-[#f8f5ed]
        py-4
        sm:py-5
      "
    >
      {/* TOP RIGHT GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-96
          w-96
          rounded-full
          bg-[#b9d19a]/30
          blur-3xl
        "
      />

      {/* BOTTOM LEFT GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -left-32
          h-96
          w-96
          rounded-full
          bg-[#355e3b]/10
          blur-3xl
        "
      />

      <Container>
        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-md
          "
        >
          {/* HEADER */}

          <div className="mb-5 text-center">

            <h1
              className="
                mt-2
                text-3xl
                font-light
                text-[#0d1a12]
                sm:text-4xl
              "
            >
              ثبت‌نام
            </h1>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-[#0d1a12]/60
              "
            >
              حساب خود را بسازید و تجربه‌ی
              متفاوت MATCH را شروع کنید.
            </p>
          </div>

          {/* CARD */}

          <div
            className="
              rounded-[32px]
              border
              border-[#b9d19a]/40
              bg-white/70
              p-5
              shadow-[0_30px_80px_-40px_rgba(13,26,18,0.35)]
              backdrop-blur-xl
              sm:p-6
            "
          >
            {/* MODE SWITCH */}

            <div
              className="
                mb-4
                grid
                grid-cols-2
                rounded-2xl
                bg-[#f1eee5]
                p-1
              "
            >
              <button
                type="button"
                onClick={() =>
                  handleChangeMode("phone")
                }
                className={`
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  transition
                  ${
                    mode === "phone"
                      ? "bg-white text-[#355e3b] shadow-sm"
                      : "text-[#0d1a12]/50 hover:text-[#0d1a12]"
                  }
                `}
              >
                ثبت‌نام با موبایل
              </button>

              <button
                type="button"
                onClick={() =>
                  handleChangeMode("email")
                }
                className={`
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  transition
                  ${
                    mode === "email"
                      ? "bg-white text-[#355e3b] shadow-sm"
                      : "text-[#0d1a12]/50 hover:text-[#0d1a12]"
                  }
                `}
              >
                ثبت‌نام با ایمیل
              </button>
            </div>

            {/* ERROR */}

            {error && (
              <div
                role="alert"
                className="
                  mb-4
                  rounded-2xl
                  border
                  border-red-100
                  bg-red-50
                  px-4
                  py-2.5
                  text-center
                  text-sm
                  leading-6
                  text-red-600
                "
              >
                {error}
              </div>
            )}

            {/* PHONE */}

            {mode === "phone" && (
              <form
                onSubmit={
                  handlePhoneRegistration
                }
                className="space-y-4"
              >
                {/* NAME */}

                <div>
                  <label
                    htmlFor="phone-firstName"
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-[#0d1a12]/75
                    "
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
                    placeholder="مثلاً میلاد"
                    autoComplete="given-name"
                    disabled={isLoading}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-[#0d1a12]/10
                      bg-white/80
                      px-4
                      py-3
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

                {/* PHONE */}

                <div>
                  <label
                    htmlFor="register-phone"
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
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-[#0d1a12]/10
                      bg-white/80
                      px-4
                      py-3
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    mt-1
                    w-full
                    rounded-full
                    bg-[#0d1a12]
                    py-3
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
                  {isLoading
                    ? "در حال ارسال کد..."
                    : "دریافت کد تأیید"}
                </button>
              </form>
            )}

            {/* EMAIL */}

            {mode === "email" && (
              <form
                onSubmit={
                  handleEmailRegistration
                }
                className="space-y-3.5"
              >
                {/* NAME */}

                <div>
                  <label
                    htmlFor="email-firstName"
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-[#0d1a12]/75
                    "
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
                    placeholder="مثلاً میلاد"
                    autoComplete="given-name"
                    disabled={isLoading}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-[#0d1a12]/10
                      bg-white/80
                      px-4
                      py-2.5
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

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="register-email"
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-[#0d1a12]/75
                    "
                  >
                    ایمیل
                  </label>

                  <input
                    id="register-email"
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
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-[#0d1a12]/10
                      bg-white/80
                      px-4
                      py-2.5
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
                    htmlFor="register-password"
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-[#0d1a12]/75
                    "
                  >
                    رمز عبور
                  </label>

                  <input
                    id="register-password"
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
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-[#0d1a12]/10
                      bg-white/80
                      px-4
                      py-2.5
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

                {/* CONFIRM PASSWORD */}

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-[#0d1a12]/75
                    "
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
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-[#0d1a12]/10
                      bg-white/80
                      px-4
                      py-2.5
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    mt-1
                    w-full
                    rounded-full
                    bg-[#0d1a12]
                    py-3
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
                  {isLoading
                    ? "در حال ثبت‌نام..."
                    : "ثبت‌نام"}
                </button>
              </form>
            )}

            {/* LOGIN */}

            <div
              className="
                mt-4
                text-center
                text-sm
                text-[#0d1a12]/50
              "
            >
              قبلاً حساب کاربری دارید؟

              {" "}

              <Link
                href="/login"
                className="
                  font-semibold
                  text-[#355e3b]
                  transition
                  hover:text-[#0d1a12]
                "
              >
                وارد شوید
              </Link>
            </div>

            {/* FOOTER */}

            <p
              className="
                mt-3
                text-center
                text-xs
                leading-5
                text-[#0d1a12]/35
              "
            >
              با ثبت‌نام در حساب کاربری،
              شرایط استفاده از سرویس را
              می‌پذیرید.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
