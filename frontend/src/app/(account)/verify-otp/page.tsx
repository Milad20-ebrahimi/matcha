
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

type VerifyMode = "login" | "register";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setSession } = useAuthContext();

  const mode: VerifyMode =
    searchParams.get("mode") === "register"
      ? "register"
      : "login";

  const [otpId, setOtpId] =
    useState<string | null>(null);

  const [phone, setPhone] =
    useState<string | null>(null);

  const [firstName, setFirstName] =
    useState<string | null>(null);

  const [code, setCode] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD OTP DATA
  // ==========================================

  useEffect(() => {
    if (mode === "register") {
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

      if (!savedOtpId || !savedPhone) {
        router.replace("/register");

        return;
      }

      setOtpId(savedOtpId);
      setPhone(savedPhone);
      setFirstName(savedFirstName);

      return;
    }

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
  }, [mode, router]);

  // ==========================================
  // VERIFY OTP
  // ==========================================

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

      // ========================================
      // REGISTER WITH PHONE
      // ========================================

      if (mode === "register") {
        /*
         * اگر شماره قبلاً ثبت شده باشد،
         * اجازه ثبت‌نام مجدد نمی‌دهیم.
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

        const savedFirstName =
          firstName?.trim();

        if (!savedFirstName) {
          setError(
            "نام کاربر پیدا نشد. لطفاً ثبت‌نام را دوباره انجام دهید."
          );

          return;
        }

        /*
         * تکمیل ثبت‌نام بعد از تأیید OTP
         */

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

      // ========================================
      // LOGIN WITH PHONE
      // ========================================

      /*
       * کاربر جدید نباید مستقیماً
       * از Login وارد حساب شود.
       */

      if (
        isNewUser &&
        needsName
      ) {
        sessionStorage.setItem(
          "matcha_registration_otp_id",
          otpId
        );

        sessionStorage.setItem(
          "matcha_registration_phone",
          phone ?? ""
        );

        sessionStorage.removeItem(
          "matcha_registration_first_name"
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
       * پاک کردن اطلاعات موقت Login
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

  // ==========================================
  // BACK
  // ==========================================

  function handleBack() {
    if (mode === "register") {
      router.push(
        "/register?mode=phone"
      );

      return;
    }

    router.push("/login");
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
        justify-center
        overflow-hidden
        bg-[#f8f5ed]
        px-4
        py-6
        sm:px-6
        sm:py-10
      "
    >
      {/* TOP RIGHT GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-[#b9d19a]/30
          blur-3xl
          sm:h-96
          sm:w-96
        "
      />

      {/* BOTTOM LEFT GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -left-32
          h-80
          w-80
          rounded-full
          bg-[#355e3b]/10
          blur-3xl
          sm:h-96
          sm:w-96
        "
      />

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
        "
      >
        {/* CARD */}

        <div
          className="
            rounded-[32px]
            border
            border-[#b9d19a]/40
            bg-white/75
            p-6
            shadow-[0_30px_80px_-40px_rgba(13,26,18,0.35)]
            backdrop-blur-xl
            sm:rounded-[40px]
            sm:p-9
          "
        >
          {/* BRAND */}

          <div className="mb-7 text-center sm:mb-8">

            <p
              className="
                text-xs
                tracking-[0.3em]
                text-[#355e3b]
              "
            >
              MATCH—CAFE
            </p>

            <h1
              className="
                mt-4
                text-2xl
                font-light
                text-[#0d1a12]
                sm:text-3xl
              "
            >
              تأیید شماره موبایل
            </h1>

            <p
              className="
                mx-auto
                mt-3
                max-w-sm
                text-sm
                leading-7
                text-[#0d1a12]/55
              "
            >
              {mode === "register"
                ? "برای تکمیل ثبت‌نام، کد تأیید ارسال‌شده به شماره موبایل زیر را وارد کنید."
                : "کد تأیید ارسال‌شده به شماره موبایل زیر را وارد کنید."}
            </p>

            {phone && (
              <div
                dir="ltr"
                className="
                  mt-4
                  inline-flex
                  rounded-full
                  bg-[#f2eee4]
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-[#0d1a12]
                "
              >
                {phone}
              </div>
            )}
          </div>

          {/* ERROR */}

          {error && (
            <div
              role="alert"
              className="
                mb-5
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

          {/* OTP FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="otp"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#0d1a12]/75
                "
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
                disabled={
                  isLoading
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#0d1a12]/10
                  bg-white/80
                  px-5
                  py-4
                  text-center
                  text-xl
                  font-medium
                  tracking-[0.5em]
                  text-[#0d1a12]
                  outline-none
                  transition
                  placeholder:text-[#0d1a12]/20
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
              disabled={
                isLoading ||
                code.length !== 6
              }
              className="
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
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
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
              className="
                w-full
                py-1
                text-sm
                text-[#0d1a12]/50
                transition
                hover:text-[#355e3b]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              بازگشت
            </button>
          </form>

          {/* SECURITY NOTE */}

          <p
            className="
              mt-6
              text-center
              text-xs
              leading-5
              text-[#0d1a12]/35
            "
          >
            کد تأیید را فقط در همین صفحه وارد کنید.
          </p>
        </div>
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
          className="
            flex
            min-h-screen
            items-center
            justify-center
            bg-[#f8f5ed]
            px-4
          "
        >
          <div
            className="
              text-sm
              text-[#0d1a12]/50
            "
          >
            در حال بارگذاری...
          </div>
        </main>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
