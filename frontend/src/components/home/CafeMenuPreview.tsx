"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Container from "@/components/shared/Container";
import { menuItems } from "@/data/menuItems";

export default function CafeMenuPreview() {
  const [active, setActive] = useState(0);

  function next() {
    setActive((prev) =>
      prev === menuItems.length - 1 ? 0 : prev + 1
    );
  }

  function prev() {
    setActive((prev) =>
      prev === 0 ? menuItems.length - 1 : prev - 1
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#f8f5ed] py-16">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm tracking-[6px] text-[#d97706]">
            MENU
          </p>

          <p className="mt-3 text-sm text-[#355e3b]/60">
            انتخابی از نوشیدنی‌ها و خوراکی‌های اختصاصی کافه ماچا
          </p>
        </div>

        <div className="relative mx-auto mt-10 h-[360px] max-w-5xl">
          {menuItems.map((item, index) => {
            const offset = index - active;
            const distance = Math.abs(offset);
            const isActive = offset === 0;

            return (
              <article
                key={item.id}
                onClick={() => setActive(index)}
                className="absolute left-1/2 top-0 w-[240px] cursor-pointer transition-all duration-700"
                style={{
                  transform: `
                    translateX(calc(${offset * 140}px - 50%))
                    scale(${isActive ? 1 : 0.82})
                    rotateY(${offset * -16}deg)
                  `,
                  opacity:
                    distance > 2
                      ? 0
                      : isActive
                        ? 1
                        : 0.45,
                  zIndex: 50 - distance,
                  filter: isActive ? "none" : "blur(1px)",
                }}
              >
                <div className="overflow-hidden rounded-[32px] border border-[#eee8db] bg-white shadow-xl">
                  <div className="relative h-[220px]">
                    <Image
                      src={
                        item.imageUrl ||
                        "/images/matcha-hero.JPG"
                      }
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="font-serif text-xl font-bold text-[#355e3b]">
                      {item.name}
                    </h3>

                    <Link
                      href={`/menu?category=${item.category}`}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-4 inline-flex text-sm font-semibold text-[#d97706] transition hover:text-[#355e3b]"
                    >
                      مشاهده دسته ←
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={prev}
            aria-label="قبلی"
            className="h-10 w-10 rounded-full border border-[#355e3b]/20 text-[#355e3b] transition hover:bg-[#355e3b] hover:text-white"
          >
            ‹
          </button>

          <div className="flex gap-2">
            {menuItems.map((item, index) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setActive(index)}
                aria-label={`انتخاب ${item.name}`}
                className={`h-2 rounded-full transition-all ${
                  active === index
                    ? "w-7 bg-[#d97706]"
                    : "w-2 bg-[#355e3b]/20"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="بعدی"
            className="h-10 w-10 rounded-full border border-[#355e3b]/20 text-[#355e3b] transition hover:bg-[#355e3b] hover:text-white"
          >
            ›
          </button>
        </div>

        <Link
          href="/menu"
          className="mt-6 block text-center text-sm font-semibold text-[#355e3b] hover:text-[#d97706]"
        >
          مشاهده منوی کامل
        </Link>
      </Container>
    </section>
  );
}
