
"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";

import type { Product } from "@/features/products/types";
import { useCart } from "@/features/cart/hooks/useCart";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addToCart } = useCart();

const isOutOfStock =
  product.stock <= 0 || !product.isActive;

const handleAddToCart = () => {
  if (isOutOfStock) return;

  void addToCart(product.id);
};

  return (
    <article
      dir="rtl"
      className="
        group
        overflow-hidden
        rounded-[2rem]
        border
        border-[#203c27]/10
        bg-white
        shadow-sm
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Image */}

      <Link
        href={`/shop/${product.slug}`}
        className="
          relative
          block
          aspect-square
          overflow-hidden
          bg-[#f1eade]
        "
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 50vw,
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
              w-full
              items-center
              justify-center
              text-6xl
            "
          >
            🍵
          </div>
        )}

        {/* Product badge */}

        {product.badge && (
          <span
            className="
              absolute
              right-4
              top-4
              rounded-full
              bg-[#d97706]
              px-3
              py-1.5
              text-xs
              font-bold
              text-white
              shadow-md
            "
          >
            {product.badge}
          </span>
        )}

        {/* Out of stock */}

        {isOutOfStock && (
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-[#203c27]/55
              backdrop-blur-[2px]
            "
          >
            <span
              className="
                rounded-full
                bg-white
                px-5
                py-2.5
                text-sm
                font-bold
                text-[#203c27]
                shadow-lg
              "
            >
              ناموجود
            </span>
          </div>
        )}
      </Link>

      {/* Content */}

      <div className="p-5">
        {/* Category */}

        {product.category && (
          <p
            className="
              text-xs
              font-semibold
              text-[#d97706]
            "
          >
            {product.category.name}
          </p>
        )}

        {/* Name */}

        <Link
          href={`/shop/${product.slug}`}
          className="
            mt-2
            block
            text-lg
            font-bold
            text-[#203c27]
            transition-colors
            hover:text-[#d97706]
          "
        >
          {product.name}
        </Link>

        {/* Description */}

        {product.description && (
          <p
            className="
              mt-2
              line-clamp-2
              min-h-[3.5rem]
              text-sm
              leading-7
              text-[#203c27]/60
            "
          >
            {product.description}
          </p>
        )}

        {/* Price */}

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            {product.oldPrice &&
              product.oldPrice > product.price && (
                <p
                  className="
                    text-xs
                    text-gray-400
                    line-through
                  "
                >
                  {product.oldPrice.toLocaleString(
                    "fa-IR"
                  )}{" "}
                  تومان
                </p>
              )}

            <p
              className="
                mt-1
                text-lg
                font-bold
                text-[#203c27]
              "
            >
              {product.price.toLocaleString(
                "fa-IR"
              )}{" "}
              <span className="text-xs font-medium">
                تومان
              </span>
            </p>
          </div>

          {/* Stock */}

          {!isOutOfStock &&
            product.stock <= 5 && (
              <span
                className="
                  text-xs
                  font-medium
                  text-[#d97706]
                "
              >
                فقط {product.stock} عدد
              </span>
            )}
        </div>

        {/* Actions */}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="
              flex
              flex-1
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#203c27]
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-[#355e3b]
              hover:shadow-lg
              disabled:cursor-not-allowed
              disabled:bg-gray-300
            "
          >
            <ShoppingBag size={17} />

            {isOutOfStock
              ? "ناموجود"
              : "افزودن به سبد"}
          </button>

          <Link
            href={`/shop/${product.slug}`}
            aria-label={`مشاهده ${product.name}`}
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-[#203c27]/10
              text-[#203c27]
              transition-all
              duration-300
              hover:border-[#203c27]
              hover:bg-[#f8f5ed]
            "
          >
            <ArrowLeft size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
