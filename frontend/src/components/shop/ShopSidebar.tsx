
"use client";

import { useState } from "react";
import {
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ShopCategory =
  | "all"
  | "Matcha"
  | "Coffee"
  | "Tea"
  | "Accessories";

export type ShopPriceRange =
  | "all"
  | "under-500"
  | "500-1000"
  | "1000-2000"
  | "over-2000";

interface ShopSidebarProps {
  open?: boolean;
  onClose?: () => void;

  category: ShopCategory;
  priceRange: ShopPriceRange;
  onlyAvailable: boolean;

  onCategoryChange: (
    category: ShopCategory
  ) => void;

  onPriceRangeChange: (
    priceRange: ShopPriceRange
  ) => void;

  onAvailabilityChange: (
    value: boolean
  ) => void;

  onReset: () => void;
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

const categories: {
  label: string;
  value: ShopCategory;
}[] = [
  {
    label: "همه محصولات",
    value: "all",
  },
  {
    label: "ماچا",
    value: "Matcha",
  },
  {
    label: "قهوه",
    value: "Coffee",
  },
  {
    label: "چای",
    value: "Tea",
  },
  {
    label: "ابزار دم‌آوری",
    value: "Accessories",
  },
];

/* -------------------------------------------------------------------------- */
/* Price ranges                                                               */
/* -------------------------------------------------------------------------- */

const priceRanges: {
  label: string;
  value: ShopPriceRange;
}[] = [
  {
    label: "همه قیمت‌ها",
    value: "all",
  },
  {
    label: "زیر ۵۰۰ هزار تومان",
    value: "under-500",
  },
  {
    label: "۵۰۰ هزار تا ۱ میلیون تومان",
    value: "500-1000",
  },
  {
    label: "۱ تا ۲ میلیون تومان",
    value: "1000-2000",
  },
  {
    label: "بالای ۲ میلیون تومان",
    value: "over-2000",
  },
];

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function ShopSidebar({
  open = true,
  onClose,
  category,
  priceRange,
  onlyAvailable,
  onCategoryChange,
  onPriceRangeChange,
  onAvailabilityChange,
  onReset,
}: ShopSidebarProps) {
  const [categoryOpen, setCategoryOpen] =
    useState(true);

  const [priceOpen, setPriceOpen] =
    useState(true);

  return (
    <>
      {/* ================================================================== */}
      {/* Mobile Overlay                                                     */}
      {/* ================================================================== */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-[#0d1a12]/40
            backdrop-blur-sm
            lg:hidden
          "
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ================================================================== */}
      {/* Sidebar                                                             */}
      {/* ================================================================== */}

      <aside
        dir="rtl"
        className={`
          fixed
          right-0
          top-0
          z-50
          h-screen
          w-[300px]
          overflow-y-auto
          border-l
          border-[#0d1a12]/10
          bg-[#fffdf7]
          px-6
          py-7
          shadow-2xl
          transition-transform
          duration-300

          ${
            open
              ? "translate-x-0"
              : "translate-x-full"
          }

          lg:sticky
          lg:top-24
          lg:h-auto
          lg:max-h-[calc(100vh-120px)]
          lg:w-full
          lg:translate-x-0
          lg:rounded-[32px]
          lg:border
          lg:shadow-[0_20px_60px_-35px_rgba(13,26,18,0.35)]
        `}
      >
        {/* ================================================================ */}
        {/* Header                                                            */}
        {/* ================================================================ */}

        <div
          className="
            mb-7
            flex
            items-center
            justify-between
            border-b
            border-[#0d1a12]/10
            pb-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[#0d1a12]
                text-[#b9d19a]
              "
            >
              <SlidersHorizontal size={18} />
            </div>

            <div>
              <h2
                className="
                  text-base
                  font-medium
                  text-[#0d1a12]
                "
              >
                فیلتر محصولات
              </h2>

              <p
                className="
                  mt-1
                  text-[11px]
                  text-[#0d1a12]/45
                "
              >
                محصولات موردنظر خود را پیدا کنید
              </p>
            </div>
          </div>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#0d1a12]/10
              text-[#0d1a12]/60
              transition
              hover:bg-[#0d1a12]
              hover:text-white
              lg:hidden
            "
            aria-label="بستن فیلترها"
          >
            <X size={17} />
          </button>
        </div>

        {/* ================================================================ */}
        {/* Categories                                                        */}
        {/* ================================================================ */}

        <section
          className="
            border-b
            border-[#0d1a12]/10
            pb-6
          "
        >
          <button
            type="button"
            onClick={() =>
              setCategoryOpen(
                (previous) => !previous
              )
            }
            aria-expanded={categoryOpen}
            className="
              flex
              w-full
              items-center
              justify-between
              text-right
            "
          >
            <h3
              className="
                text-sm
                font-semibold
                text-[#0d1a12]
              "
            >
              دسته‌بندی
            </h3>

            <ChevronDown
              size={17}
              className={`
                text-[#0d1a12]/40
                transition-transform
                duration-300
                ${
                  categoryOpen
                    ? "rotate-180"
                    : "rotate-0"
                }
              `}
            />
          </button>

          <div
            className={`
              overflow-hidden
              transition-all
              duration-300
              ${
                categoryOpen
                  ? "mt-4 max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }
            `}
          >
            <div className="space-y-1.5">
              {categories.map((item) => {
                const isSelected =
                  category === item.value;

                return (
                  <label
                    key={item.value}
                    className="
                      group
                      flex
                      cursor-pointer
                      items-center
                      rounded-2xl
                      px-3
                      py-2.5
                      transition
                      hover:bg-[#f2e9d8]/60
                    "
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="category"
                        value={item.value}
                        checked={isSelected}
                        onChange={() =>
                          onCategoryChange(
                            item.value
                          )
                        }
                        className="
                          h-4
                          w-4
                          accent-[#355e3b]
                        "
                      />

                      <span
                        className={`
                          text-sm
                          transition-colors
                          ${
                            isSelected
                              ? "font-medium text-[#355e3b]"
                              : "text-[#0d1a12]/70 group-hover:text-[#0d1a12]"
                          }
                        `}
                      >
                        {item.label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Price                                                             */}
        {/* ================================================================ */}

        <section
          className="
            border-b
            border-[#0d1a12]/10
            py-6
          "
        >
          <button
            type="button"
            onClick={() =>
              setPriceOpen(
                (previous) => !previous
              )
            }
            aria-expanded={priceOpen}
            className="
              flex
              w-full
              items-center
              justify-between
              text-right
            "
          >
            <h3
              className="
                text-sm
                font-semibold
                text-[#0d1a12]
              "
            >
              محدوده قیمت
            </h3>

            <ChevronDown
              size={17}
              className={`
                text-[#0d1a12]/40
                transition-transform
                duration-300
                ${
                  priceOpen
                    ? "rotate-180"
                    : "rotate-0"
                }
              `}
            />
          </button>

          <div
            className={`
              overflow-hidden
              transition-all
              duration-300
              ${
                priceOpen
                  ? "mt-4 max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }
            `}
          >
            <div className="space-y-1.5">
              {priceRanges.map((item) => {
                const isSelected =
                  priceRange === item.value;

                return (
                  <label
                    key={item.value}
                    className="
                      group
                      flex
                      cursor-pointer
                      items-center
                      gap-3
                      rounded-2xl
                      px-3
                      py-2.5
                      transition
                      hover:bg-[#f2e9d8]/60
                    "
                  >
                    <input
                      type="radio"
                      name="price"
                      value={item.value}
                      checked={isSelected}
                      onChange={() =>
                        onPriceRangeChange(
                          item.value
                        )
                      }
                      className="
                        h-4
                        w-4
                        accent-[#355e3b]
                      "
                    />

                    <span
                      className={`
                        text-sm
                        transition-colors
                        ${
                          isSelected
                            ? "font-medium text-[#355e3b]"
                            : "text-[#0d1a12]/70 group-hover:text-[#0d1a12]"
                        }
                      `}
                    >
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Availability                                                      */}
        {/* ================================================================ */}

        <section className="py-6">
          <div
            className="
              mb-4
              flex
              items-center
              justify-between
            "
          >
            <h3
              className="
                text-sm
                font-semibold
                text-[#0d1a12]
              "
            >
              وضعیت محصول
            </h3>

            <ChevronDown
              size={16}
              className="text-[#0d1a12]/40"
            />
          </div>

          <label
            className="
              flex
              cursor-pointer
              items-center
              justify-between
              rounded-2xl
              border
              border-[#0d1a12]/10
              bg-[#f8f5ed]/70
              px-4
              py-3
              transition
              hover:border-[#355e3b]/30
            "
          >
            <span
              className="
                text-sm
                text-[#0d1a12]/70
              "
            >
              فقط محصولات موجود
            </span>

            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(event) =>
                onAvailabilityChange(
                  event.target.checked
                )
              }
              className="
                h-5
                w-5
                rounded
                accent-[#355e3b]
              "
            />
          </label>
        </section>

        {/* ================================================================ */}
        {/* Reset                                                             */}
        {/* ================================================================ */}

        <button
          type="button"
          onClick={onReset}
          className="
            w-full
            rounded-full
            border
            border-[#0d1a12]/15
            px-5
            py-3
            text-sm
            font-medium
            text-[#0d1a12]/70
            transition
            hover:border-[#0d1a12]
            hover:bg-[#0d1a12]
            hover:text-white
          "
        >
          حذف همه فیلترها
        </button>
      </aside>
    </>
  );
}
