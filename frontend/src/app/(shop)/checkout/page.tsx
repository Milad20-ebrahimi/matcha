"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks";
import { useCart } from "@/features/cart/cart.context";
import { useAddressContext } from "@/features/addresses/address.context";
import { createOrder } from "@/features/orders/api";

export default function CheckoutPage() {
const router = useRouter();

const {
user,
isAuthenticated,
isLoading: authLoading,
} = useAuth();

const {
cart,
isLoading: cartLoading,
} = useCart();

const {
addresses,
isLoading: addressLoading,
} = useAddressContext();

const [
selectedAddressId,
setSelectedAddressId,
] = useState<string | null>(null);

const [
isSubmitting,
setIsSubmitting,
] = useState(false);

const [
error,
setError,
] = useState<string | null>(null);

/*

* انتقال کاربر مهمان به Login
  */
  useEffect(() => {
  if (authLoading) {
  return;
  }

if (!isAuthenticated) {

  router.replace(
    "/login?redirect=/checkout",
  );
}

}, [
authLoading,
isAuthenticated,
router,
]);

/*

* انتخاب خودکار آدرس پیش‌فرض
  */
  useEffect(() => {
  if (
  selectedAddressId ||
  addresses.length === 0
  ) {
  return;
  }

const defaultAddress =

  addresses.find(
    (address) =>
      address.isDefault,
  );

setSelectedAddressId(
  defaultAddress?.id ??
    addresses[0].id,
);

}, [
addresses,
selectedAddressId,
]);

/*

* آدرس انتخاب‌شده
  */
  const selectedAddress =
  addresses.find(
  (address) =>
  address.id ===
  selectedAddressId,
  );

/*

* تعداد کل محصولات
  */
  const totalItems =
  cart.items.reduce(
  (total, item) =>
  total + item.quantity,
  0,
  );

/*

* مبلغ کل
*
* اطلاعات محصول از Cart Backend
* دریافت شده است.
  */
  const totalPrice = useMemo(() => {
  return cart.items.reduce(
  (total, item) =>
  total +
  item.product.price *
  item.quantity,
  0,
  );
  }, [cart.items]);

/*

* هزینه ارسال
*
* فعلاً رایگان.
* بعداً می‌توانیم سیستم محاسبه
* هزینه ارسال را اضافه کنیم.
  */
  const shippingCost = 0;

const finalPrice =
totalPrice + shippingCost;

/*

* ثبت سفارش
  */
  async function handleSubmitOrder() {
  if (!selectedAddress) {
  setError(
  "لطفاً یک آدرس برای ارسال سفارش انتخاب کنید.",
  );

  return;
  }

if (cart.items.length === 0) {

  setError(
    "سبد خرید شما خالی است.",
  );

  return;
}

try {
  setIsSubmitting(true);
  setError(null);

  /*
   * چون Backend فعلاً shippingAddress
   * را به صورت text دریافت می‌کند،
   * اطلاعات کامل آدرس را JSON می‌کنیم.
   */
  const shippingAddress =
    JSON.stringify({
      title:
        selectedAddress.title,

      recipientName:
        selectedAddress.recipientName,

      recipientPhone:
        selectedAddress.recipientPhone,

      province:
        selectedAddress.province,

      city:
        selectedAddress.city,

      address:
        selectedAddress.address,

      postalCode:
        selectedAddress.postalCode,

      plaque:
        selectedAddress.plaque,

      unit:
        selectedAddress.unit,

      latitude:
        selectedAddress.latitude,

      longitude:
        selectedAddress.longitude,
    });

  const result =
    await createOrder({
      shippingAddress,
    });

  /*
   * بعد از ایجاد موفق سفارش،
   * کاربر را به صفحه سفارش می‌فرستیم.
   *
   * اگر صفحه Order هنوز ساخته نشده،
   * فعلاً به Checkout برمی‌گردیم.
   */
  router.push(
    `/account/orders/${result.order.id}`,
  );
} catch (error) {
  console.error(
    "Create order error:",
    error,
  );

  setError(
    error instanceof Error
      ? error.message
      : "خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.",
  );
} finally {
  setIsSubmitting(false);
}

}

/*

* Loading
  */
  if (
  authLoading ||
  cartLoading ||
  addressLoading
  ) {
  return (

   <main className="mx-auto w-full max-w-6xl px-4 py-12">
     <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
       <p className="text-slate-500">
         در حال آماده‌سازی صفحه پرداخت...
       </p>
     </div>
   </main>

);

}

/*

* کاربر مهمان
  */
  if (!isAuthenticated) {
  return (

   <main className="mx-auto w-full max-w-6xl px-4 py-12">
     <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
       <p className="text-slate-500">
         در حال انتقال به صفحه ورود...
       </p>
     </div>
   </main>

);

}

/*

* سبد خالی
  */
  if (cart.items.length === 0) {
  return (

   <main className="mx-auto w-full max-w-6xl px-4 py-12">
     <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
       <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
         🛒
       </div>

   <h1 className="mt-5 text-2xl font-bold text-slate-900">
     سبد خرید شما خالی است
   </h1>

   <p className="mt-3 text-slate-500">
     برای ادامه، ابتدا محصولی به
     سبد خرید اضافه کنید.
   </p>

   <Link
     href="/shop"
     className="mt-7 inline-flex rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
   >
     رفتن به فروشگاه
   </Link>

     </div>
   </main>

);

}

return ( <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
{/* Header */} <div className="mb-8"> <p className="text-sm font-medium text-slate-500">
MATCHA CAFE </p>

    <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
      تکمیل سفارش
    </h1>

    <p className="mt-2 text-slate-500">
      اطلاعات ارسال سفارش خود را بررسی
      و سفارش را ثبت کنید.
    </p>
  </div>

  {/* Error */}
  {error && (
    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {error}
    </div>
  )}

  <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
    {/* Main */}
    <div className="space-y-6">
      {/* Customer */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              اطلاعات گیرنده
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              اطلاعات حساب کاربری شما
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            حساب کاربری
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">
              نام
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {user?.firstName ||
                "ثبت نشده"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">
              شماره موبایل
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {user?.phone ||
                "ثبت نشده"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
            <p className="text-xs text-slate-500">
              ایمیل
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {user?.email ||
                "ثبت نشده"}
            </p>
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              آدرس ارسال
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              آدرس موردنظر برای ارسال
              سفارش را انتخاب کنید.
            </p>
          </div>

          <Link
            href="/account/addresses"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            مدیریت آدرس‌ها
          </Link>
        </div>

        {addresses.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <p className="font-medium text-slate-900">
              هنوز آدرسی ثبت نکرده‌اید
            </p>

            <p className="mt-2 text-sm text-slate-500">
              برای ثبت سفارش ابتدا یک
              آدرس اضافه کنید.
            </p>

            <Link
              href="/account/addresses"
              className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              افزودن آدرس
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {addresses.map(
              (address) => {
                const isSelected =
                  selectedAddressId ===
                  address.id;

                return (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() =>
                      setSelectedAddressId(
                        address.id,
                      )
                    }
                    className={`w-full rounded-2xl border p-4 text-right transition ${
                      isSelected
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-slate-900"
                            : "border-slate-300"
                        }`}
                      >
                        {isSelected && (
                          <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {address.title}
                          </span>

                          {address.isDefault && (
                            <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white">
                              پیش‌فرض
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {address.province}
                          {"، "}
                          {address.city}
                          {"، "}
                          {address.address}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                          <span>
                            گیرنده:{" "}
                            {
                              address.recipientName
                            }
                          </span>

                          <span>
                            موبایل:{" "}
                            {
                              address.recipientPhone
                            }
                          </span>

                          <span>
                            کد پستی:{" "}
                            {
                              address.postalCode
                            }
                          </span>

                          {address.plaque && (
                            <span>
                              پلاک:{" "}
                              {
                                address.plaque
                              }
                            </span>
                          )}

                          {address.unit && (
                            <span>
                              واحد:{" "}
                              {
                                address.unit
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              },
            )}
          </div>
        )}
      </section>

      {/* Products */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              سفارش شما
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {totalItems.toLocaleString(
                "fa-IR",
              )}{" "}
              کالا
            </p>
          </div>

          <Link
            href="/cart"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ویرایش سبد
          </Link>
        </div>

        <div className="mt-6 divide-y divide-slate-100">
          {cart.items.map(
            (item) => (
              <div
                key={item.id}
                className="flex gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                  {item.product.image ? (
                    <img
                      src={
                        item.product.image
                      }
                      alt={
                        item.product.name
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                      بدون تصویر
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">
                    {item.product.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    تعداد:{" "}
                    {item.quantity.toLocaleString(
                      "fa-IR",
                    )}
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-700">
                    {item.product.price.toLocaleString(
                      "fa-IR",
                    )}{" "}
                    تومان
                  </p>
                </div>

                <div className="text-left">
                  <p className="font-bold text-slate-900">
                    {(
                      item.product
                        .price *
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
              مبلغ کالاها
            </span>

            <span className="font-medium text-slate-900">
              {totalPrice.toLocaleString(
                "fa-IR",
              )}{" "}
              تومان
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              هزینه ارسال
            </span>

            <span className="font-medium text-emerald-600">
              رایگان
            </span>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-end justify-between gap-4">
              <span className="font-bold text-slate-900">
                مبلغ نهایی
              </span>

              <div className="text-left">
                <p className="text-2xl font-bold text-slate-900">
                  {finalPrice.toLocaleString(
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

        <button
          type="button"
          disabled={
            isSubmitting ||
            !selectedAddress ||
            addresses.length === 0
          }
          onClick={() => {
            void handleSubmitOrder();
          }}
          className="mt-6 w-full rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "در حال ثبت سفارش..."
            : "ثبت سفارش"}
        </button>

        {!selectedAddress &&
          addresses.length > 0 && (
            <p className="mt-3 text-center text-xs text-amber-600">
              ابتدا یک آدرس انتخاب کنید.
            </p>
          )}

        {addresses.length === 0 && (
          <p className="mt-3 text-center text-xs text-amber-600">
            برای ثبت سفارش ابتدا یک
            آدرس اضافه کنید.
          </p>
        )}

        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          با ثبت سفارش، اطلاعات سفارش
          شما برای پردازش و ارسال به
          سیستم منتقل می‌شود.
        </p>
      </div>
    </aside>
  </div>
</main>

);
}
