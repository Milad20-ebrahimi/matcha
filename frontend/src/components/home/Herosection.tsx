"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import Container from "@/components/shared/Container";

const slides = [
  {
    id: 1,
    image: "/images/matcha-hero.JPG",
    eyebrow: "محصولات تازه",
    title: "تجربه اصیل ماچا",
    description:
      "ماچا، قهوه و محصولات پریمیوم را با کیفیتی متفاوت تجربه کنید.",
    ctaLabel: "مشاهده محصولات",
    ctaHref: "/shop",
  },
  {
    id: 2,
    image: "/images/matcha-hero1.JPG",
    eyebrow: "MATCHA CAFE",
    title: "هر فنجان، یک تجربه متفاوت",
    description:
      "از انتخاب مواد اولیه تا آماده‌سازی، همه چیز با دقت و عشق انجام می‌شود.",
    ctaLabel: "مشاهده کافه",
    ctaHref: "/cafe",
  },
  {
    id: 3,
    image: "/images/matcha-hero2.JPG",
    eyebrow: "فضای کافه",
    title: "جایی برای ماندن",
    description:
      "فضایی آرام برای نوشیدن، گفتگو و ساختن لحظه‌های خوب.",
    ctaLabel: "درباره ما",
    ctaHref: "/about",
  },
];

const cafePhone = "021-12345678";
const cafeAddress = "تهران، خیابان ولیعصر";

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const touchStartX = useRef<number | null>(null);

  const activeSlide = slides[activeIndex];

  const goTo = useCallback((index: number) => {
    const nextIndex =
      (index + slides.length) % slides.length;

    setActiveIndex(nextIndex);
  }, []);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  /*
   * Auto Play
   */
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      goNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeIndex, isPlaying, goNext]);

  /*
   * Scroll / Parallax
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /*
   * Keyboard Navigation
   */
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "ArrowLeft") {
        goNext();
      }

      if (event.key === "ArrowRight") {
        goPrev();
      }

      if (event.key === " ") {
        event.preventDefault();

        setIsPlaying((value) => !value);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [goNext, goPrev]);

  /*
   * Swipe
   */
  const handleTouchStart = (
    event: React.TouchEvent
  ) => {
    touchStartX.current =
      event.touches[0].clientX;
  };

  const handleTouchEnd = (
    event: React.TouchEvent
  ) => {
    if (touchStartX.current === null) {
      return;
    }

    const delta =
      event.changedTouches[0].clientX -
      touchStartX.current;

    if (delta < -50) {
      goNext();
    }

    if (delta > 50) {
      goPrev();
    }

    touchStartX.current = null;
  };

  const parallaxOffset = Math.min(
    Math.max(scrollY * 0.12, 0),
    30
  );

  return (
    <section
      dir="rtl"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="
        relative
        isolate
        h-screen
        min-h-[680px]
        overflow-hidden
        bg-stone-950
      "
    >

      {/* Screen Reader */}
      <div
        className="sr-only"
        aria-live="polite"
      >
        اسلاید {activeIndex + 1} از {slides.length}:{" "}
        {activeSlide.title}
      </div>

      {/* Background Slides */}
      {slides.map((slide, index) => {
        const isActive =
          index === activeIndex;

        return (
          <div
            key={slide.id}
            className={`
              absolute
              inset-0
              transition-opacity
              duration-700
              ${
                isActive
                  ? "z-10 opacity-100"
                  : "z-0 opacity-0"
              }
            `}
            aria-hidden={!isActive}
          >

            <div
              className="absolute inset-0"
              style={{
                transform: isActive
                  ? `translateY(${parallaxOffset}px) scale(1.03)`
                  : "scale(1)",
                transition:
                  "transform 700ms ease-out",
              }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>

            {/* Dark Overlay */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/90
                via-black/55
                to-black/10
              "
            />

          </div>
        );
      })}

      {/* Contact / Cafe Status */}
      <div
        className="
          absolute
          right-6
          top-28
          z-30
          hidden
          w-[230px]
          flex-col
          gap-3
          rounded-2xl
          border
          border-white/20
          bg-white/10
          p-4
          shadow-xl
          backdrop-blur-xl
          sm:flex
        "
      >

        {/* Status */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >

          <span
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-emerald-400/30
              bg-emerald-400/10
              px-3
              py-1
              text-xs
              font-medium
              text-emerald-300
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-400
                shadow-[0_0_8px_rgba(52,211,153,0.8)]
              "
            />

            باز است
          </span>

        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Phone */}
        <a
          href={`tel:${cafePhone}`}
          className="
            flex
            items-center
            justify-between
            gap-3
            text-xs
            text-stone-200
            transition
            hover:text-amber-300
          "
        >
          <span className="text-white/50">
            تماس
          </span>

          <span dir="ltr">
            {cafePhone}
          </span>
        </a>

        {/* Address */}
        <div
          className="
            flex
            flex-col
            gap-1
            text-xs
          "
        >
          <span className="text-white/50">
            آدرس
          </span>

          <span className="leading-6 text-stone-300">
            {cafeAddress}
          </span>
        </div>

      </div>

      {/* Content */}
      <div
        className="
          relative
          z-20
          flex
          h-full
          items-end
          pb-32
        "
      >
        <Container>

          <div
            key={activeSlide.id}
            className="
              max-w-xl
              animate-heroContent
            "
          >

            {/* Eyebrow */}
            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-amber-400/30
                bg-amber-400/10
                px-4
                py-2
                text-xs
                font-semibold
                text-amber-300
                backdrop-blur-sm
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-amber-400
                "
              />

              {activeSlide.eyebrow}
            </span>

            {/* Title */}
            <h1
              className="
                mt-5
                text-4xl
                font-extrabold
                leading-[1.35]
                text-white
                sm:text-5xl
                lg:text-6xl
              "
            >
              {activeSlide.title}
            </h1>

            {/* Description */}
            <p
              className="
                mt-5
                max-w-md
                text-base
                leading-8
                text-stone-300
                sm:text-lg
              "
            >
              {activeSlide.description}
            </p>

            {/* CTA */}
            <Link
              href={activeSlide.ctaHref}
              className="
                mt-8
                inline-flex
                items-center
                rounded-full
                bg-[#d97706]
                px-8
                py-4
                font-bold
                text-black
                shadow-lg
                shadow-black/20
                transition
                duration-300
                hover:scale-105
                hover:bg-[#e58a1a]
              "
            >
              {activeSlide.ctaLabel}
            </Link>

          </div>

        </Container>
      </div>

      {/* Controls */}
      <div
        className="
          absolute
          bottom-6
          left-6
          right-6
          z-30
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            flex
            gap-3
          "
        >

          {/* Previous */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="اسلاید قبلی"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/30
              bg-black/10
              text-xl
              text-white
              backdrop-blur
              transition
              hover:bg-white/10
            "
          >
            ‹
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={goNext}
            aria-label="اسلاید بعدی"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/30
              bg-black/10
              text-xl
              text-white
              backdrop-blur
              transition
              hover:bg-white/10
            "
          >
            ›
          </button>

        </div>

      </div>

    </section>
  );
}
