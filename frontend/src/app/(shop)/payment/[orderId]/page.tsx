"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getPaymentByOrder,
  updatePaymentStatus,
} from "@/features/payments/api";

import type {
  PaymentWithOrder,
} from "@/features/payments/types";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();

  const orderId =
    typeof params.orderId === "string"
      ? params.orderId
      : "";

  const [
    paymentData,
    setPaymentData,
  ] = useState<PaymentWithOrder | null>(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    async function loadPayment() {
      try {
        setIsLoading(true);
        setError(null);

        const result =
          await getPaymentByOrder(orderId);

        setPaymentData(result);
      } catch (error) {
        console.error(
          "Load payment error:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "خطا در دریافت اطلاعات پرداخت.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadPayment();
  }, [orderId]);

  async function handlePayment() {
    if (!paymentData) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await updatePaymentStatus(
        paymentData.payment.id,
        {
          status: "PAID",
          authority:
            `TEST-${paymentData.payment.id}`,
          refId:
            `REF-${Date.now()}`,
        },
      );

      router.push(
        `/account/orders/${orderId}`,
      );
    } catch (error) {
      console.error(
        "Payment error:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "پرداخت با خطا مواجه شد.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">
            در حال دریافت اطلاعات پرداخت...
          </p>
        </div>
      </main>
    );
  }

  if (error && !paymentData) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-bold text-red-900">
            خطا در پرداخت
          </h1>

          <p className="mt-3 text-sm text-red-700">
            {error}
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </main>
    );
  }

  if (!paymentData) {
    return null;
  }

  const {
    payment,
    order,
  } = paymentData;

  const isPaid =
    payment.status === "PAID";

  const isFailed =
    payment.status === "FAILED";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">
          MATCHA CAFE
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          پرداخت سفارش
        </h1>

        <p className="mt-2 text-slate-500">
          پرداخت سفارش خود را تکمیل کنید.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                شماره سفارش
              </p>

              <p className="mt-1 break-all font-semibold text-slate-900">
                {orderId}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isPaid
                  ? "bg-emerald-100 text-emerald-700"
                  : isFailed
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {isPaid
                ? "پرداخت شده"
                : isFailed
                  ? "ناموفق"
                  : "در انتظار پرداخت"}
            </span>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-6">
            <p className="text-sm text-slate-500">
              مبلغ قابل پرداخت
            </p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-4xl font-bold text-slate-900">
                {payment.amount.toLocaleString(
                  "fa-IR",
                )}
              </span>

              <span className="mb-1 text-sm text-slate-500">
                تومان
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-sm text-slate-500">
                روش پرداخت
              </span>

              <span className="font-medium text-slate-900">
                {payment.method === "ONLINE"
                  ? "پرداخت آنلاین"
                  : "پرداخت نقدی"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                وضعیت پرداخت
              </span>

              <span className="font-medium text-slate-900">
                {payment.status === "PENDING"
                  ? "در انتظار پرداخت"
                  : payment.status === "PAID"
                    ? "پرداخت موفق"
                    : payment.status ===
                        "FAILED"
                      ? "پرداخت ناموفق"
                      : "مسترد شده"}
              </span>
            </div>
          </div>
        </section>

        <aside>
          <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              تأیید پرداخت
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              شما در حال پرداخت سفارش خود
              هستید. پس از تکمیل پرداخت،
              سفارش شما ثبت و نهایی خواهد شد.
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  مبلغ نهایی
                </span>

                <span className="font-bold text-slate-900">
                  {payment.amount.toLocaleString(
                    "fa-IR",
                  )}{" "}
                  تومان
                </span>
              </div>
            </div>

            {isPaid ? (
              <Link
                href={`/account/orders/${orderId}`}
                className="mt-6 flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-4 font-semibold text-white transition hover:bg-emerald-700"
              >
                مشاهده سفارش
              </Link>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  void handlePayment();
                }}
                className="mt-6 w-full rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "در حال پردازش پرداخت..."
                  : "پرداخت و تکمیل سفارش"}
              </button>
            )}

            <Link
              href="/cart"
              className="mt-3 flex w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              بازگشت به سبد خرید
            </Link>

            <p className="mt-5 text-center text-xs leading-5 text-slate-400">
              این بخش در حال حاضر برای تست
              جریان پرداخت استفاده می‌شود و
              هنوز به درگاه بانکی واقعی متصل
              نشده است.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}