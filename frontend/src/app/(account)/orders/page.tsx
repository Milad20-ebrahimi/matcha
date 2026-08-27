"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth/hooks";
import { getOrders } from "@/features/orders/api";
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

export default function OrdersPage() {
  const {
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();

  const [
    orders,
    setOrders,
  ] = useState<Order[]>([]);

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

    async function loadOrders() {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await getOrders();

        setOrders(data);
      } catch (error) {
        console.error(
          "Get orders error:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "خطا در دریافت سفارش‌ها.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrders();
  }, [
    authLoading,
    isAuthenticated,
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
            در حال دریافت سفارش‌ها...
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
            برای مشاهده سفارش‌های خود ابتدا وارد حساب کاربری شوید.
          </p>

          <Link
            href="/login?redirect=/account/orders"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            ورود به حساب
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">
          MATCHA CAFE
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
          سفارش‌های من
        </h1>

        <p className="mt-2 text-slate-500">
          تاریخچه سفارش‌ها و وضعیت سفارش‌های خود را مشاهده کنید.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
            🛍️
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            هنوز سفارشی ثبت نکرده‌اید
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            محصولات موردنظر خود را از فروشگاه انتخاب کنید و اولین سفارش خود را ثبت کنید.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            رفتن به فروشگاه
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md md:p-6"
            >
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs text-slate-400">
                      شماره سفارش
                    </p>

                    <p className="mt-1 break-all font-semibold text-slate-900">
                      {order.id}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                      {getStatusLabel(order.status)}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        order.paymentStatus === "PAID"
                          ? "bg-emerald-50 text-emerald-700"
                          : order.paymentStatus === "FAILED"
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

                <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-400">
                      تاریخ ثبت
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {formatDate(
                        order.createdAt,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      تعداد کالا
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {order.items.reduce(
                        (
                          total,
                          item,
                        ) =>
                          total +
                          item.quantity,
                        0,
                      ).toLocaleString(
                        "fa-IR",
                      )}{" "}
                      کالا
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      مبلغ سفارش
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {order.totalAmount.toLocaleString(
                        "fa-IR",
                      )}{" "}
                      تومان
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm text-slate-500">
                    مشاهده جزئیات سفارش
                  </span>

                  <span className="text-lg text-slate-400">
                    ←
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
