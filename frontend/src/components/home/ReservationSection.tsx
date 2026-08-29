"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ArrowLeft } from "lucide-react";

import Container from "@/components/shared/Container";
import Reveal from "@/components/shared/Reveal";

export default function ReservationSection() {
  return (
    <section className="bg-white py-24">
      <Container>

        <Reveal>

          <div
            className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            bg-[#203c27]
            "
          >

            <div
              className="
              absolute
              inset-0
              "
            >

              <Image
                src="/images/cafe/cafe-main.jpg"
                alt=""
                fill
                className="
                object-cover
                opacity-20
                "
              />

            </div>


            <div
              className="
              relative
              z-10
              grid
              items-center
              gap-10
              px-7
              py-14
              md:px-14
              lg:grid-cols-[1fr_auto]
              "
            >

              <div className="text-right">

                <span
                  className="
                  text-sm
                  font-semibold
                  tracking-[0.25em]
                  text-[#f5d08a]
                  "
                >
                  RESERVE YOUR TABLE
                </span>

                <h2
                  className="
                  mt-4
                  font-serif
                  text-3xl
                  font-bold
                  leading-[1.5]
                  text-white
                  md:text-5xl
                  "
                >
                  میز خود را در کافه ماچا رزرو کنید
                </h2>

                <p
                  className="
                  mt-5
                  max-w-2xl
                  text-sm
                  leading-8
                  text-white/70
                  md:text-base
                  "
                >
                  برای یک تجربه آرام و متفاوت،
                  میز خود را از قبل رزرو کنید و
                  لحظاتتان را با ماچا و قهوه تخصصی
                  کامل‌تر کنید.
                </p>


                <div
                  className="
                  mt-7
                  flex
                  flex-wrap
                  items-center
                  gap-5
                  text-sm
                  text-white/70
                  "
                >

                  <div className="flex items-center gap-2">
                    <CalendarDays size={18} />
                    رزرو آسان و سریع
                  </div>

                  <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />

                  <span>
                    هر روز ۸ صبح تا ۱۰ شب
                  </span>

                </div>

              </div>


              <Link
                href="/reservation"
                className="
                inline-flex
                items-center
                justify-center
                gap-3
                rounded-full
                bg-[#d97706]
                px-8
                py-4
                text-sm
                font-bold
                text-white
                transition
                hover:scale-105
                hover:bg-[#b45309]
                "
              >

                رزرو میز

                <ArrowLeft size={18} />

              </Link>

            </div>

          </div>

        </Reveal>

      </Container>
    </section>
  );
}
