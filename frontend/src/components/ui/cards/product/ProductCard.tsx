"use client";

import Link from "next/link";
import type { Product } from "@/features/products/types";
import AddToCartButton from "@/features/products/components/AddToCartButton";

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <div
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
      <Link href={`/shop/${product.slug}`}>
        <div
          className="
            relative
            h-72
            overflow-hidden
            bg-[#f2e9d8]
          "
        >
          <img
            src={
              product.image ||
              "/images/menu-placeholder.JPG"
            }
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 p-4">
          <h3
            className="
              font-serif
              text-lg
              font-light
              tracking-wide
              text-[#203c27]
              transition-colors
              duration-300
              group-hover:text-[#355e3b]
            "
          >
            {product.name}
          </h3>

          <div className="mt-2 flex items-center gap-3">
            <span
              className="
                text-lg
                font-bold
                text-[#355e3b]
              "
            >
              {product.price.toLocaleString()}

              <span className="ml-1 text-xs font-normal">
                تومان
              </span>
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-yellow-500">
              ★
            </span>

            <span className="text-sm text-gray-500">
              {product.rating}
            </span>
          </div>
        </div>
      </Link>

      <div className="mt-auto px-5 pb-5">
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
