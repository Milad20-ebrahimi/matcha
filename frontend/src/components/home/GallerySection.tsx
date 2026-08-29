"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

import Container from "@/components/shared/Container";

const galleryImages = [
  {
    src: "/images/IMG_3081.JPG",
    alt: "فضای کافه ماچا",
  },
  {
    src: "/images/IMG_3082.JPG",
    alt: "نوشیدنی ماچا",
  },
  {
    src: "/images/IMG_3169.JPG",
    alt: "فضای داخلی کافه",
  },
  {
    src: "/images/IMG_6159.JPG",
    alt: "نوشیدنی کافه",
  },
  {
    src: "/images/IMG_7213.JPG",
    alt: "لحظهای از کافه ماچا",
  },
  {
    src: "/images/matcha-hero.JPG",
    alt: "ماچا",
  },
  {
    src: "/images/matcha-hero1.JPG",
    alt: "فضای کافه",
  },
  {
    src: "/images/matcha-hero2.JPG",
    alt: "نوشیدنی ماچا",
  },
];

export default function GallerySection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const speed = 0.35;

    const animate = () => {
      if (!pausedRef.current) {
        const singleWidth = track.scrollWidth / 2;

        offsetRef.current += speed;

        if (offsetRef.current >= singleWidth) {
          offsetRef.current = 0;
        }

        track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const moveGallery = (direction: "left" | "right") => {
    const track = trackRef.current;

    if (!track) return;

    const amount = 260;

    if (direction === "left") {
      offsetRef.current += amount;
    } else {
      offsetRef.current -= amount;

      if (offsetRef.current < 0) {
        offsetRef.current = 0;
      }
    }

    track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
  };

  const duplicatedImages = [...galleryImages, ...galleryImages];

  return (
    <section className="overflow-hidden bg-cream py-12 sm:py-16">
      <Container>
        <div className="relative" dir="ltr">
          <button
            type="button"
            onClick={() => moveGallery("right")}
            aria-label="تصویر قبلی"
            className="absolute left-[-14px] top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-forest/10 bg-white text-forest shadow-lg transition hover:scale-105 hover:bg-forest hover:text-white sm:left-[-22px]"
          >
            <ChevronLeft size={22} />
          </button>

          <div
            className="overflow-hidden px-1 py-2"
            onMouseEnter={() => {
              pausedRef.current = true;
            }}
            onMouseLeave={() => {
              pausedRef.current = false;
            }}
          >
            <div
              ref={trackRef}
              className="flex w-max gap-4 will-change-transform"
            >
              {duplicatedImages.map((image, index) => (
                <div
                  key={`${image.src}-${index}`}
                  className="group relative aspect-square w-[190px] shrink-0 overflow-hidden rounded-2xl sm:w-[220px] lg:w-[235px]"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="235px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => moveGallery("left")}
            aria-label="تصویر بعدی"
            className="absolute right-[-14px] top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-forest/10 bg-white text-forest shadow-lg transition hover:scale-105 hover:bg-forest hover:text-white sm:right-[-22px]"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/gallery"
            className="inline-flex min-w-[190px] items-center justify-center rounded-xl border-2 border-forest px-8 py-3.5 text-sm font-semibold text-forest transition hover:bg-forest hover:text-white"
          >
            مشاهده گالری
          </Link>
        </div>
      </Container>
    </section>
  );
}
