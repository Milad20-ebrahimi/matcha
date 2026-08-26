"use client";

import Link from "next/link";

import type {
  Product,
} from "@/features/products/types";

import {
  useCart,
} from "@/features/cart/cart.context";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const {
    addToCart,
  } = useCart();

  const isOutOfStock =
    product.stock <= 0;

  function handleAddToCart() {
    if (isOutOfStock) {
      return;
    }

    addToCart(
      product.id,
      1,
    );
  }

  return (
    <Card>
      <Link
        href={`/shop/${product.slug}`}
        className="block"
      >
        <div className="flex h-48 items-center justify-center overflow-hidden rounded-xl bg-green-900">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <span className="text-white">
              تصویر محصول
            </span>
          )}
        </div>

        <h3 className="mt-5 text-lg font-semibold text-slate-900">
          {product.name}
        </h3>

        {product.category && (
          <p className="mt-2 text-sm text-slate-500">
            {product.category.name}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-slate-900">
            {product.price.toLocaleString("fa-IR")} تومان
          </span>

          <span className="text-sm text-slate-500">
            موجودی:{" "}
            {product.stock.toLocaleString(
              "fa-IR",
            )}
          </span>
        </div>
      </Link>

      <Button
        type="button"
        disabled={isOutOfStock}
        onClick={handleAddToCart}
        className="mt-5 w-full"
      >
        {isOutOfStock
          ? "ناموجود"
          : "افزودن به سبد"}
      </Button>
    </Card>
  );
}
