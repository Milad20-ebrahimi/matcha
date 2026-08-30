"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getOrderById } from "@/features/orders/api";
import type { Order } from "@/features/orders/types";

function getOrderStatusLabel(status: Order["status"]) {
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

function getPaymentStatusLabel(status: Order["paymentStatus"]) {
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

function formatPrice(value: number) {
return `${value.toLocaleString("fa-IR")} تومان`;
}

export default function OrderDetailPage({
params,
}: {
params: Promise<{ id: string }>;
}) {
const [order, setOrder] = useState<Order | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
let cancelled = false;

async function loadOrder() {
  try {
    setIsLoading(true);
    setError(null);

    const { id } = await params;

    if (!id) {
      throw new Error("شناسه سفارش معتبر نیست.");
    }

    const result = await getOrderById(id);

    if (!cancelled) {
      setOrder(result);
    }
  } catch (error) {
    console.error("Get order error:", error);

    if (!cancelled) {
      setError(
        error instanceof Error
          ? error.message
          : "خطا در دریافت اطلاعات سفارش.",
      );
    }
  } finally {
    if (!cancelled) {
      setIsLoading(false);
    }
  }
}

void loadOrder();

return () => {
  cancelled = true;
};

}, [params]);

if (isLoading) {
return ( <main className="mx-auto w-full max-w-6xl px-4 py-12"> <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm"> <p className="text-slate-500">
در حال دریافت اطلاعات سفارش... </p> </div> </main>
);
}

if (error || !order) {
return ( <main className="mx-auto w-full max-w-6xl px-4 py-12"> <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm"> <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">
! </div>

      <h1 className="mt-5 text-2xl font-bold text-slate-900">
        سفارش پیدا نشد
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {error || "امکان دریافت اطلاعات این سفارش وجود ندارد."}
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/account/orders"
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          مشاهده سفارش‌ها
        </Link>

        <Link
          href="/shop"
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    </div>
  </main>
);

}

const createdAt = new Date(order.createdAt);

return ( <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12"> <div className="mb-8"> <Link
       href="/account/orders"
       className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
     >
← بازگشت به سفارش‌ها </Link>

    <p className="mt-6 text-sm font-medium text-slate-500">
      MATCHA CAFE
    </p>

    <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
          جزئیات سفارش
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          سفارش شما با موفقیت ثبت شده است.
        </p>
      </div>

      <div className="text-left">
        <p className="text-xs text-slate-400">
          شماره سفارش
        </p>

        <p className="mt-1 break-all font-mono text-sm font-medium text-slate-700">
          {order.id}
        </p>
      </div>
    </div>
  </div>

  <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              وضعیت سفارش
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              آخرین وضعیت سفارش شما
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            {getOrderStatusLabel(order.status)}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">
              وضعیت پرداخت
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              {getPaymentStatusLabel(order.paymentStatus)}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">
              تاریخ ثبت سفارش
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              {createdAt.toLocaleDateString("fa-IR")}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            محصولات سفارش
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {order.items.length.toLocaleString("fa-IR")} محصول
          </p>
        </div>

        <div className="mt-6 divide-y divide-slate-100">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">
                  {item.productName}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  تعداد:{" "}
                  {item.quantity.toLocaleString("fa-IR")}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  قیمت واحد: {formatPrice(item.productPrice)}
                </p>
              </div>

              <div className="shrink-0 text-left">
                <p className="font-bold text-slate-900">
                  {formatPrice(
                    item.productPrice * item.quantity,
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          آدرس ارسال
        </h2>

        <div className="mt-5 rounded-2xl bg-slate-50 p-5">
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {order.shippingAddress}
          </p>
        </div>
      </section>
    </div>

    <aside>
      <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          خلاصه سفارش
        </h2>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              تعداد محصولات
            </span>

            <span className="font-medium text-slate-900">
              {order.items
                .reduce(
                  (total, item) =>
                    total + item.quantity,
                  0,
                )
                .toLocaleString("fa-IR")}
            </span>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-end justify-between gap-4">
              <span className="font-bold text-slate-900">
                مبلغ نهایی
              </span>

              <div className="text-left">
                <p className="text-2xl font-bold text-slate-900">
                  {order.totalAmount.toLocaleString("fa-IR")}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  تومان
                </p>
              </div>
            </div>
          </div>
        </div>

        {order.paymentStatus === "PENDING" && (
          <Link
            href={`/payment/${order.id}`}
            className="mt-6 flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white transition hover:bg-slate-800"
          >
            ادامه پرداخت
          </Link>
        )}

        <Link
          href="/account/orders"
          className="mt-3 flex w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-4 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          همه سفارش‌ها
        </Link>
      </div>
    </aside>
  </div>
</main>

);
}
