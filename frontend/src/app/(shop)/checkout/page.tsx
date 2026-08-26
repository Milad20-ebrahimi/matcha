"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks";
import { useCart } from "@/features/cart/cart.context";

export default function CheckoutPage() {
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    isLoading,
  } = useAuth();

  const { cart } = useCart();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(
        "/login?redirect=/checkout",
      );
    }
  }, [
    isLoading,
    isAuthenticated,
    router,
  ]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 p-8 text-center">
          در حال بررسی حساب کاربری...
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 p-8 text-center">
          در حال انتقال به صفحه ورود...
        </div>
      </main>
    );
  }

  if (cart.items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 p-8 text-center">
          <h1 className="text-2xl font-bold">
            سبد خرید شما خالی است
          </h1>

          <p className="mt-3 text-slate-500">
            برای ادامه پرداخت ابتدا محصولی به سبد خرید اضافه کنید.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">
        تکمیل سفارش
      </h1>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold">
          اطلاعات مشتری
        </h2>

        <div className="mt-5 space-y-2 text-slate-600">
          <p>
            نام: {user?.firstName}
          </p>

          <p>
            تلفن: {user?.phone || "ثبت نشده"}
          </p>

          <p>
            ایمیل: {user?.email || "ثبت نشده"}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold">
          سفارش شما
        </h2>

        <p className="mt-4 text-slate-500">
          تعداد کالاها:{" "}
          {cart.items
            .reduce(
              (total, item) =>
                total + item.quantity,
              0,
            )
            .toLocaleString("fa-IR")}
        </p>

        <button
          type="button"
          className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800"
        >
          ثبت سفارش
        </button>
      </div>
    </main>
  );
}