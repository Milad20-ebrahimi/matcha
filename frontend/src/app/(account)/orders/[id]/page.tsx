"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth/hooks";
import { getOrderById } from "@/features/orders/api";
import type { Order } from "@/features/orders/types";

function getStatusLabel(
  status: Order["status"],
) {
  switch (status) {
    case "PENDING":
      return "در انتظار بررسی";

    case "CONFIRMED":
      return "تأیید شده";

    case "PROCESSING":
      return "در حال آماده‌سازی";

    case "SHIPPED":
      return "ارسال شده";

    case "DELIVERED":
      return "تحویل داده شده";

    case "CANCELLED":
      return "لغو شده";

    default:
      return status;
  }
}

function getPaymentStatusLabel(
  status: Order["paymentStatus"],
) {
  switch (status) {
    case "PENDING":
      return "در انتظار پرداخت";

    case "PAID":
      return "پرداخت شده";

    case "FAILED":
      return "پرداخت ناموفق";

    case "REFUNDED":
      return "مبلغ برگشت داده شده";

    default:
      return status;
  }
}

function formatDate(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "fa-IR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(new Date(date));
}

function parseShippingAddress(
  shippingAddress: string,
) {
  try {
    return JSON.parse(
      shippingAddress,
    ) as {
      title?: string;
      recipientName?: string;
      recipientPhone?: string;
      province?: string;
      city?: string;
      address?: string;
      postalCode?: string;
      plaque?: string;
      unit?: string;
    };
  } catch {
    return null;
  }
}

export default function OrderDetailsPage() {
  const params = useParams();

  const orderId =
    typeof params.id === "string"
      ? params.id
      : "";

  const {
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();

  const [
    order,
    setOrder,
  ] = useState<Order | null>(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    if (!orderId) {
      setIsLoading(false);
      setError(
        "شناسه سفارش معتبر نیست.",
      );
      return;
    }

    async function loadOrder() {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await getOrderById(
            orderId,
          );

        setOrder(data);
      } catch (error) {
        console.error(
          "Get order details error:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "خطا در دریافت جزئیات سفارش.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrder();
  }, [
    authLoading,
    isAuthenticated,
    orderId,
  ]);

  if (
    authLoading ||
    isLoading
  ) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

          <p className="mt-4 text-sm text-slate-500">
            در حال دریافت جزئیات سفارش...
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            ورود به حساب کاربری
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            برای مشاهده جزئیات سفارش ابتدا وارد حساب کاربری شوید.
          </p>

          <Link
            href={`/login?redirect=/account/orders/${orderId}`}
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            ورود به حساب
          </Link>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-bold text-red-900">
            سفارش پیدا نشد
          </h1>

          <p className="mt-3 text-sm text-red-700">
            {error ||
              "امکان دریافت اطلاعات این سفارش وجود ندارد."}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/account/orders"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              سفارش‌های من
            </Link>

            <Link
              href="/shop"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              فروشگاه
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const shipping =
    parseShippingAddress(
      order.shippingAddress,
    );

  const totalItems =
    order.items.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.quantity,
      0,
    );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/account/orders"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← بازگشت به سفارش‌های من
        </Link>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              MATCHA CAFE
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              جزئیات سفارش
            </h1>

            <p className="mt-2 break-all text-sm text-slate-500">
              شماره سفارش:{" "}
              <span className="font-medium text-slate-700">
                {order.id}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700">
              {getStatusLabel(
                order.status,
              )}
            </span>

            <span
              className={`rounded-full px-4 py-2 text-xs font-medium ${
                order.paymentStatus ===
                "PAID"
                  ? "bg-emerald-50 text-emerald-700"
                  : order.paymentStatus ===
                      "FAILED"
                    ? "bg-red-50 text-red-700"
                    : "bg-amber-50 text-amber-700"
              }`}
            >
              {getPaymentStatusLabel(
                order.paymentStatus,
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Main */}
        <div className="space-y-6">
          {/* Order info */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              اطلاعات سفارش
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  تاریخ ثبت سفارش
                </p>

                <p className="mt-2 text-sm font-medium text-slate-900">
                  {formatDate(
                    order.createdAt,
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  آخرین بروزرسانی
                </p>

                <p className="mt-2 text-sm font-medium text-slate-900">
                  {formatDate(
                    order.updatedAt,
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  تعداد کالا
                </p>

                <p className="mt-2 text-sm font-medium text-slate-900">
                  {totalItems.toLocaleString(
                    "fa-IR",
                  )}{" "}
                  کالا
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  وضعیت پرداخت
                </p>

                <p className="mt-2 text-sm font-medium text-slate-900">
                  {getPaymentStatusLabel(
                    order.paymentStatus,
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Products */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  محصولات سفارش
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {totalItems.toLocaleString(
                    "fa-IR",
                  )}{" "}
                  کالا
                </p>
              </div>

              <Link
                href="/shop"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                ادامه خرید
              </Link>
            </div>

            <div className="mt-6 divide-y divide-slate-100">
              {order.items.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {item.productName}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                        <span>
                          تعداد:{" "}
                          {item.quantity.toLocaleString(
                            "fa-IR",
                          )}
                        </span>

                        <span>
                          قیمت واحد:{" "}
                          {item.productPrice.toLocaleString(
                            "fa-IR",
                          )}{" "}
                          تومان
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 sm:text-left">
                      <p className="font-bold text-slate-900">
                        {(
                          item.productPrice *
                          item.quantity
                        ).toLocaleString(
                          "fa-IR",
                        )}{" "}
                        تومان
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* Shipping address */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              آدرس ارسال
            </h2>

            {shipping ? (
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                {shipping.title && (
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900">
                      {shipping.title}
                    </h3>
                  </div>
                )}

                {shipping.recipientName && (
                  <p className="mt-3 text-sm text-slate-700">
                    گیرنده:{" "}
                    <span className="font-medium">
                      {
                        shipping.recipientName
                      }
                    </span>
                  </p>
                )}

                {shipping.recipientPhone && (
                  <p className="mt-2 text-sm text-slate-700">
                    موبایل:{" "}
                    <span className="font-medium">
                      {
                        shipping.recipientPhone
                      }
                    </span>
                  </p>
                )}

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {shipping.province}
                  {shipping.province &&
                    shipping.city &&
                    "، "}
                  {shipping.city}
                  {shipping.city &&
                    shipping.address &&
                    "، "}
                  {shipping.address}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                  {shipping.postalCode && (
                    <span>
                      کد پستی:{" "}
                      {
                        shipping.postalCode
                      }
                    </span>
                  )}

                  {shipping.plaque && (
                    <span>
                      پلاک:{" "}
                      {shipping.plaque}
                    </span>
                  )}

                  {shipping.unit && (
                    <span>
                      واحد:{" "}
                      {shipping.unit}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm leading-7 text-slate-600">
                  {order.shippingAddress}
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Summary */}
        <aside>
          <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              خلاصه سفارش
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  تعداد کالا
                </span>

                <span className="font-medium text-slate-900">
                  {totalItems.toLocaleString(
                    "fa-IR",
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  مبلغ سفارش
                </span>

                <span className="font-medium text-slate-900">
                  {order.totalAmount.toLocaleString(
                    "fa-IR",
                  )}{" "}
                  تومان
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  وضعیت سفارش
                </span>

                <span className="font-medium text-slate-900">
                  {getStatusLabel(
                    order.status,
                  )}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-end justify-between gap-4">
                  <span className="font-bold text-slate-900">
                    مبلغ نهایی
                  </span>

                  <div className="text-left">
                    <p className="text-2xl font-bold text-slate-900">
                      {order.totalAmount.toLocaleString(
                        "fa-IR",
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      تومان
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {order.paymentStatus ===
              "PENDING" && (
              <button
                type="button"
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white opacity-50"
              >
                پرداخت آنلاین
              </button>
            )}

            {order.paymentStatus ===
              "PAID" && (
              <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-center">
                <p className="text-sm font-medium text-emerald-700">
                  پرداخت این سفارش با موفقیت انجام شده است.
                </p>
              </div>
            )}

            <Link
              href="/account/orders"
              className="mt-4 flex w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              بازگشت به سفارش‌ها
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
