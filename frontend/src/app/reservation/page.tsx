
"use client";

import { useState } from "react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Container from "@/components/shared/Container";

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: "",
    date: "",
    time: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setSubmitted(false);
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.guests ||
      !formData.date ||
      !formData.time
    ) {
      setError("لطفاً تمام فیلدهای ضروری را پر کنید.");
      setSubmitted(false);
      return;
    }

    setError("");
    setSubmitted(true);

    console.log(formData);

    setFormData({
      name: "",
      phone: "",
      guests: "",
      date: "",
      time: "",
      message: "",
    });
  }

  return (
    <>
      <Navbar />

      <main
        dir="rtl"
        className="min-h-screen bg-[var(--color-cream)] pt-[104px]"
      >
        {/* ================================================================ */}
        {/* Hero                                                               */}
        {/* ================================================================ */}

        <section className="px-6 pb-6 pt-4 md:pb-7 md:pt-5">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[10px] tracking-[0.35em] text-[var(--color-amber)]">
                RESERVATION
              </p>

              <p className="mx-auto mt-3 max-w-xl text-xs leading-7 text-[var(--color-forest)]/55 md:text-sm">
                میز مورد علاقه‌تان را برای یک تجربه آرام از ماچا و قهوه رزرو
                کنید.
              </p>
            </div>
          </Container>
        </section>

        {/* ================================================================ */}
        {/* Reservation Form                                                   */}
        {/* ================================================================ */}

        <section className="px-4 pb-10 md:px-6 md:pb-12">
          <Container>
            <div
              className="
                mx-auto
                max-w-4xl
                rounded-[32px]
                border
                border-[var(--color-forest)]/10
                bg-white/80
                px-6
                py-8
                shadow-[0_25px_70px_-35px_rgba(16,37,26,0.35)]
                backdrop-blur-xl
                sm:px-10
                sm:py-10
                md:rounded-[38px]
                md:px-11
                md:py-11
              "
            >
              {/* Form Header */}

              <div className="text-center">
                <p className="text-[10px] tracking-[0.3em] text-[var(--color-sage-dark)]">
                  RESERVATION FORM
                </p>

                <h2 className="mt-3 text-2xl font-light text-[var(--color-forest)] md:text-3xl">
                  فرم رزرو میز
                </h2>

                <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[var(--color-forest)]/45">
                  اطلاعات خود را وارد کنید تا میز شما در فضای آرام کافه ماچا
                  آماده شود.
                </p>
              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* Name + Phone */}

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs text-[var(--color-forest)]/70"
                    >
                      نام و نام خانوادگی
                    </label>

                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="نام خود را وارد کنید"
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-[var(--color-forest)]/10
                        bg-white/80
                        px-4
                        text-xs
                        text-[var(--color-forest)]
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-[var(--color-sage)]
                        focus:ring-4
                        focus:ring-[var(--color-sage)]/15
                      "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs text-[var(--color-forest)]/70"
                    >
                      شماره موبایل
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="09xxxxxxxxx"
                      dir="ltr"
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-[var(--color-forest)]/10
                        bg-white/80
                        px-4
                        text-xs
                        text-[var(--color-forest)]
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-[var(--color-sage)]
                        focus:ring-4
                        focus:ring-[var(--color-sage)]/15
                      "
                    />
                  </div>
                </div>

                {/* Guests + Date + Time */}

                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label
                      htmlFor="guests"
                      className="mb-2 block text-xs text-[var(--color-forest)]/70"
                    >
                      تعداد نفرات
                    </label>

                    <input
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      type="number"
                      min="1"
                      placeholder="2"
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-[var(--color-forest)]/10
                        bg-white/80
                        px-4
                        text-xs
                        text-[var(--color-forest)]
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:border-[var(--color-sage)]
                        focus:ring-4
                        focus:ring-[var(--color-sage)]/15
                      "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="date"
                      className="mb-2 block text-xs text-[var(--color-forest)]/70"
                    >
                      تاریخ
                    </label>

                    <input
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      type="date"
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-[var(--color-forest)]/10
                        bg-white/80
                        px-4
                        text-xs
                        text-[var(--color-forest)]
                        outline-none
                        transition
                        focus:border-[var(--color-sage)]
                        focus:ring-4
                        focus:ring-[var(--color-sage)]/15
                      "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="time"
                      className="mb-2 block text-xs text-[var(--color-forest)]/70"
                    >
                      ساعت
                    </label>

                    <input
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      type="time"
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-[var(--color-forest)]/10
                        bg-white/80
                        px-4
                        text-xs
                        text-[var(--color-forest)]
                        outline-none
                        transition
                        focus:border-[var(--color-sage)]
                        focus:ring-4
                        focus:ring-[var(--color-sage)]/15
                      "
                    />
                  </div>
                </div>

                {/* Message */}

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-xs text-[var(--color-forest)]/70"
                  >
                    توضیحات
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="در صورت نیاز توضیحات خود را بنویسید..."
                    className="
                      min-h-[96px]
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-[var(--color-forest)]/10
                      bg-white/80
                      px-4
                      py-3
                      text-xs
                      leading-6
                      text-[var(--color-forest)]
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-[var(--color-sage)]
                      focus:ring-4
                      focus:ring-[var(--color-sage)]/15
                    "
                  />
                </div>

                {/* Error */}

                {error && (
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600">
                    {error}
                  </div>
                )}

                {/* Success */}

                {submitted && (
                  <div className="rounded-xl bg-[var(--color-sage)]/20 px-4 py-3 text-xs leading-6 text-[var(--color-forest)]">
                    درخواست رزرو شما ثبت شد. به‌زودی با شما تماس می‌گیریم.
                  </div>
                )}

                {/* Submit */}

                <button
                  type="submit"
                  className="
                    mt-2
                    h-13
                    w-full
                    rounded-full
                    bg-[var(--color-forest)]
                    text-xs
                    font-medium
                    text-[var(--color-cream)]
                    transition-all
                    duration-300
                    hover:bg-[var(--color-forest-light)]
                    hover:shadow-[0_15px_35px_-15px_rgba(16,37,26,0.6)]
                  "
                >
                  ثبت درخواست رزرو
                </button>
              </form>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
