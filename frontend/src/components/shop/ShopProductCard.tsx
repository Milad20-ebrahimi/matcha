
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Star,
  ArrowUpLeft,
} from "lucide-react";

import type { Product } from "@/features/products/types";
import { useCart } from "@/features/cart/cart.context";

interface ShopProductCardProps {
  product: Product;
}

export default function ShopProductCard({
  product,
}: ShopProductCardProps) {
  const { addToCart } = useCart();

  const isAvailable =
    product.isActive && product.stock > 0;

  const handleAddToCart = async () => {
    if (!isAvailable) return;

    try {
      await addToCart(product.id);
    } catch (error) {
      console.error(
        "Failed to add product to cart:",
        error
      );
    }
  };

  return (
    <article
      dir="rtl"
      className="
        group
        overflow-hidden
        rounded-[28px]
        border
        border-[#0d1a12]/8
        bg-white
        shadow-[0_15px_50px_-30px_rgba(13,26,18,0.35)]
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-[0_25px_60px_-30px_rgba(13,26,18,0.45)]
      "
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f8f5ed]">
        <Link
          href={`/shop/${product.slug}`}
          className="block h-full w-full"
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="
                (max-width: 640px) 50vw,
                (max-width: 1024px) 33vw,
                25vw
              "
              className="
                object-cover
                transition-transform
                duration-700
                group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                items-center
                justify-center
                text-sm
                text-[#0d1a12]/35
              "
            >
              تصویر محصول موجود نیست
            </div>
          )}
        </Link>

        {/* Badge */}
        {product.badge && (
          <div
            className="
              absolute
              right-4
              top-4
              rounded-full
              bg-[#0d1a12]
              px-3
              py-1.5
              text-[11px]
              font-medium
              text-[#d8e8bf]
              shadow-lg
            "
          >
            {product.badge}
          </div>
        )}

        {/* Unavailable */}
        {!isAvailable && (
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-[#0d1a12]/45
              backdrop-blur-[2px]
            "
          >
            <span
              className="
                rounded-full
                bg-white
                px-4
                py-2
                text-xs
                font-medium
                text-[#0d1a12]
                shadow-lg
              "
            >
              ناموجود
            </span>
          </div>
        )}

        {/* Product link */}
        <Link
          href={`/shop/${product.slug}`}
          aria-label={`مشاهده ${product.name}`}
          className="
            absolute
            bottom-4
            left-4
            flex
            h-10
            w-10
            translate-y-3
            items-center
            justify-center
            rounded-full
            bg-white
            text-[#0d1a12]
            opacity-0
            shadow-lg
            transition-all
            duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          <ArrowUpLeft size={18} />
        </Link>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category / Brand */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium text-[#355e3b]">
            {product.category?.name ?? "محصول"}
          </span>

          {product.brand && (
            <span className="truncate text-[11px] text-[#0d1a12]/40">
              {product.brand.name}
            </span>
          )}
        </div>

        {/* Name */}
        <Link
          href={`/shop/${product.slug}`}
          className="
            block
            truncate
            font-serif
            text-lg
            font-bold
            text-[#0d1a12]
            transition-colors
            hover:text-[#355e3b]
          "
        >
          {product.name}
        </Link>

        {/* Rating */}
        {product.rating !== undefined && (
          <div className="mt-3 flex items-center gap-1.5">
            <Star
              size={14}
              fill="currentColor"
              className="text-[#b58a47]"
            />

            <span className="text-xs text-[#0d1a12]/60">
              {product.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            {product.oldPrice !== undefined && (
              <div className="mb-1 text-xs text-[#0d1a12]/35 line-through">
                {product.oldPrice.toLocaleString("fa-IR")} تومان
              </div>
            )}

            <div className="text-base font-semibold text-[#355e3b]">
              {product.price.toLocaleString("fa-IR")} تومان
            </div>
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            disabled={!isAvailable}
            onClick={handleAddToCart}
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#0d1a12]
              text-white
              transition-all
              duration-300
              hover:scale-105
              hover:bg-[#355e3b]
              disabled:cursor-not-allowed
              disabled:bg-[#0d1a12]/15
              disabled:text-[#0d1a12]/35
            "
            aria-label={
              isAvailable
                ? `افزودن ${product.name} به سبد خرید`
                : "محصول ناموجود است"
            }
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
