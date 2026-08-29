
"use client";

import Link from "next/link";

import Container from "@/components/shared/Container";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
<main
  className="
  relative
  flex
  h-screen
  items-center
  overflow-hidden
  bg-[#f8f5ed]
  py-6
  "
>

      <div
        className="
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

      <div
        className="
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

        <div className="relative z-10">

          <div
            className="
            mb-10
            text-center
            "
          >


            <h1
              className="
              mt-5
              text-4xl
              font-light
              text-[#0d1a12]
              sm:text-5xl
              "
            >
              خوش آمدید
            </h1>


            <p
              className="
              mt-4
              text-sm
              leading-8
              text-[#0d1a12]/60
              "
            >
              وارد حساب خود شوید و تجربه‌ی
              متفاوت MATCH را ادامه دهید.
            </p>

          </div>


          <LoginForm />


          <p
            className="
            mx-auto
            mt-8
            max-w-md
            text-center
            text-sm
            text-[#0d1a12]/50
            "
          >

            حساب ندارید؟

            {" "}

            <Link
              href="/register"
              className="
              font-semibold
              text-[#355e3b]
              transition
              hover:text-[#0d1a12]
              "
            >
              ثبت‌نام
            </Link>

          </p>

        </div>

      </Container>

    </main>
  );
}
