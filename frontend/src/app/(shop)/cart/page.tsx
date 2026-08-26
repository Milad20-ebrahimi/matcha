"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/features/cart/cart.context";
import { getProductById } from "@/features/products/api";
import type { Product } from "@/features/products/types";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

type CartProduct = {
  product: Product;
  quantity: number;
};

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading: cartLoading,
  } = useCart();

  const [products, setProducts] =
    useState<CartProduct[]>([]);

  const [isLoadingProducts, setIsLoadingProducts] =
    useState(true);

  useEffect(() => {
    async function loadCartProducts() {
      if (!cart) {
        setProducts([]);
        setIsLoadingProducts(false);
        return;
      }

      if (cart.items.length === 0) {
        setProducts([]);
        setIsLoadingProducts(false);
        return;
      }

      setIsLoadingProducts(true);

      try {
        const results = await Promise.all(
          cart.items.map(async (item) => {
            try {
              const response =
                await getProductById(
                  item.productId,
                );

              return {
                product: response.data,
                quantity: item.quantity,
              };
            } catch {
              return null;
            }
          }),
        );

        setProducts(
          results.filter(
            (
              item,
            ): item is CartProduct =>
              item !== null,
          ),
        );
      } finally {
        setIsLoadingProducts(false);
      }
    }

    loadCartProducts();
  }, [cart]);

  const totalPrice = useMemo(() => {
    return products.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.product.price *
          item.quantity,
      0,
    );
  }, [products]);

  const totalItems =
    cart?.items.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.quantity,
      0,
    ) ?? 0;

  /*
   * Cart هنوز در حال دریافت است
   */
  if (
    cartLoading ||
    isLoadingProducts
  ) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900">
          سبد خرید
        </h1>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-slate-500">
            در حال دریافت اطلاعات سبد خرید...
          </p>
        </div>
      </main>
    );
  }

  /*
   * Cart هنوز null است
   */
  if (!cart) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            خطا در دریافت سبد خرید
          </h1>

          <p className="mt-4 text-slate-500">
            لطفاً دوباره صفحه را باز کنید.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800"
          >
            رفتن به فروشگاه
          </Link>
        </div>
      </main>
    );
  }

  /*
   * سبد خرید خالی است
   */
  if (
    cart.items.length === 0 ||
    products.length === 0
  ) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            سبد خرید شما خالی است
          </h1>

          <p className="mt-4 text-slate-500">
            هنوز محصولی به سبد خرید اضافه نکرده‌اید.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800"
          >
            رفتن به فروشگاه
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">
          سبد خرید
        </h1>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void clearCart();
          }}
        >
          خالی کردن سبد
        </Button>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Cart Items */}
        <div className="space-y-4">
          {products.map(
            ({
              product,
              quantity,
            }) => {
              const maxQuantity =
                Math.max(
                  product.stock,
                  0,
                );

              return (
                <Card
                  key={product.id}
                  className="p-4"
                >
                  <div className="flex gap-5">
                    {/* Product Image */}
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {product.image ? (
                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                          بدون تصویر
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/shop/${product.slug}`}
                            className="text-lg font-semibold text-slate-900 hover:underline"
                          >
                            {
                              product.name
                            }
                          </Link>

                          {product.category && (
                            <p className="mt-1 text-sm text-slate-500">
                              {
                                product
                                  .category
                                  .name
                              }
                            </p>
                          )}
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => {
                            void removeFromCart(
                              product.id,
                            );
                          }}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          حذف
                        </button>
                      </div>

                      {/* Bottom */}
                      <div className="mt-auto flex items-end justify-between gap-4">
                        {/* Quantity */}
                        <div className="flex items-center rounded-xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() => {
                              void updateQuantity(
                                product.id,
                                quantity - 1,
                              );
                            }}
                            className="px-4 py-2 text-lg"
                          >
                            −
                          </button>

                          <span className="min-w-10 text-center">
                            {quantity.toLocaleString(
                              "fa-IR",
                            )}
                          </span>

                          <button
                            type="button"
                            disabled={
                              quantity >=
                              maxQuantity
                            }
                            onClick={() => {
                              void updateQuantity(
                                product.id,
                                quantity + 1,
                              );
                            }}
                            className="px-4 py-2 text-lg disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-left">
                          <p className="font-bold text-slate-900">
                            {(
                              product.price *
                              quantity
                            ).toLocaleString(
                              "fa-IR",
                            )}{" "}
                            تومان
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {product.price.toLocaleString(
                              "fa-IR",
                            )}{" "}
                            تومان / عدد
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            },
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-6 p-6">
            <h2 className="text-xl font-bold text-slate-900">
              خلاصه سفارش
            </h2>

            <div className="mt-6 space-y-4">
              {/* Items Count */}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  تعداد کالا
                </span>

                <span className="font-medium">
                  {totalItems.toLocaleString(
                    "fa-IR",
                  )}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between border-t border-slate-100 pt-4">
                <span className="font-semibold">
                  مبلغ کل
                </span>

                <span className="text-xl font-bold">
                  {totalPrice.toLocaleString(
                    "fa-IR",
                  )}{" "}
                  تومان
                </span>
              </div>
            </div>

            {/* Checkout */}
            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800"
            >
              ادامه به پرداخت
            </Link>
          </Card>
        </div>
      </div>
    </main>
  );
}