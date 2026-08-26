
"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import type { Product } from "@/features/products/types";
import AddToCartButton from "@/features/products/components/AddToCartButton";

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const isOutOfStock = product.stock <= 0;

  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-[32px]
        border
        border-[#0d1a12]/10
        bg-[#fffdf7]
        shadow-[0_15px_40px_-25px_rgba(13,26,18,0.4)]
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-[#b9d19a]/50
        hover:shadow-[0_25px_60px_-30px_rgba(13,26,18,0.5)]
      "
    >
      <Link
        href={`/shop/${product.slug}`}
        className="block"
      >
        {/* Image */}
        <div
          className="
            relative
            h-72
            overflow-hidden
            bg-[#f2e9d8]
          "
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                text-sm
                text-[#355e3b]/60
              "
            >
              تصویر محصول
            </div>
          )}

          {/* Overlay */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-[#0d1a12]/30
              via-transparent
              to-transparent
              opacity-60
            "
          />

          {/* Wishlist visual button */}
          <div
            className="
              absolute
              right-4
              top-4
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-[#0d1a12]/10
              bg-white/80
              text-[#0d1a12]
              shadow-lg
              backdrop-blur-md
              transition-all
              duration-300
              group-hover:bg-[#0d1a12]
              group-hover:text-[#f2e9d8]
            "
          >
            <Heart
              size={19}
              strokeWidth={1.8}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          {product.category && (
            <div
              className="
                mb-2
                text-xs
                font-medium
                uppercase
                tracking-[0.18em]
                text-[#8aab68]
              "
            >
              {product.category.name}
            </div>
          )}

          {/* Product name */}
          <h3
            className="
              font-serif
              text-xl
              font-medium
              tracking-wide
              text-[#203c27]
              transition-colors
              duration-300
              group-hover:text-[#355e3b]
            "
          >
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p
              className="
                mt-2
                line-clamp-2
                text-sm
                leading-6
                text-[#203c27]/60
              "
            >
              {product.description}
            </p>
          )}

          {/* Price */}
          <div
            className="
              mt-5
              flex
              items-end
              justify-between
              gap-3
            "
          >
            <div>
              <div
                className="
                  text-xl
                  font-bold
                  text-[#355e3b]
                "
              >
                {product.price.toLocaleString("fa-IR")}
                <span
                  className="
                    mr-1
                    text-xs
                    font-normal
                    text-[#203c27]/60
                  "
                >
                  تومان
                </span>
              </div>
            </div>

            {/* Small availability indicator */}
            <div
              className="
                flex
                items-center
                gap-1.5
                text-xs
                text-[#203c27]/50
              "
            >
              <span
                className={`
                  h-2
                  w-2
                  rounded-full
                  ${
                    isOutOfStock
                      ? "bg-red-400"
                      : "bg-[#8aab68]"
                  }
                `}
              />

              {isOutOfStock
                ? "ناموجود"
                : "موجود"}
            </div>
          </div>
        </div>
      </Link>

      {/* Cart button */}
      <div
        className="
          mt-auto
          px-5
          pb-5
        "
      >
        <AddToCartButton
          product={product}
        />
      </div>
    </article>
  );
}
