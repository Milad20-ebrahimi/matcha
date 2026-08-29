"use client";

import { useState } from "react";

import {
  useAddressContext,
} from "@/features/addresses/address.context";

import type {
  CreateAddressInput,
} from "@/features/addresses/types";

export default function AddressesPage() {
  const {
    addresses,
    isLoading,
    error,
    addAddress,
    editAddress,
    removeAddress,
    makeDefault,
  } = useAddressContext();

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [form, setForm] =
    useState<CreateAddressInput>({
      title: "",
      recipientName: "",
      recipientPhone: "",
      province: "",
      city: "",
      address: "",
      postalCode: "",
      plaque: "",
      unit: "",
      isDefault: false,
    });

  function handleChange(
    field: keyof CreateAddressInput,
    value: string | boolean,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      await addAddress(form);

      setForm({
        title: "",
        recipientName: "",
        recipientPhone: "",
        province: "",
        city: "",
        address: "",
        postalCode: "",
        plaque: "",
        unit: "",
        isDefault: false,
      });

      setIsFormOpen(false);
    } catch {
      // خطا توسط AddressProvider مدیریت می‌شود.
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(
    addressId: string,
  ) {
    const confirmed =
      window.confirm(
        "آیا از حذف این آدرس مطمئن هستید؟",
      );

    if (!confirmed) {
      return;
    }

    try {
      await removeAddress(addressId);
    } catch {
      // خطا توسط AddressProvider مدیریت می‌شود.
    }
  }

  async function handleDefault(
    addressId: string,
  ) {
    try {
      await makeDefault(addressId);
    } catch {
      // خطا توسط AddressProvider مدیریت می‌شود.
    }
  }

  if (isLoading) {
    return (
      <main dir="rtl">
        <h1>آدرس‌های من</h1>
        <p>
          در حال دریافت آدرس‌ها...
        </p>
      </main>
    );
  }

  return (
    <main dir="rtl">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1>آدرس‌های من</h1>

          <p>
            آدرس‌های ارسال سفارش‌های خود را مدیریت کنید.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setIsFormOpen(
              (current) => !current,
            )
          }
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {isFormOpen
            ? "بستن فرم"
            : "+ افزودن آدرس"}
        </button>
      </header>

      {error && (
        <p
          style={{
            color: "#b42318",
            marginBottom: "20px",
          }}
        >
          {error}
        </p>
      )}

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "24px",
            marginBottom: "24px",
            border: "1px solid #ddd",
            borderRadius: "16px",
            display: "grid",
            gap: "16px",
          }}
        >
          <h2>افزودن آدرس جدید</h2>

          <label>
            عنوان آدرس
            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                handleChange(
                  "title",
                  event.target.value,
                )
              }
              placeholder="مثلاً خانه"
              required
            />
          </label>

          <label>
            نام گیرنده
            <input
              type="text"
              value={form.recipientName}
              onChange={(event) =>
                handleChange(
                  "recipientName",
                  event.target.value,
                )
              }
              required
            />
          </label>

          <label>
            شماره موبایل گیرنده
            <input
              type="tel"
              dir="ltr"
              value={form.recipientPhone}
              onChange={(event) =>
                handleChange(
                  "recipientPhone",
                  event.target.value,
                )
              }
              placeholder="09123456789"
              required
            />
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "16px",
            }}
          >
            <label>
              استان
              <input
                type="text"
                value={form.province}
                onChange={(event) =>
                  handleChange(
                    "province",
                    event.target.value,
                  )
                }
                required
              />
            </label>

            <label>
              شهر
              <input
                type="text"
                value={form.city}
                onChange={(event) =>
                  handleChange(
                    "city",
                    event.target.value,
                  )
                }
                required
              />
            </label>
          </div>

          <label>
            آدرس کامل
            <textarea
              value={form.address}
              onChange={(event) =>
                handleChange(
                  "address",
                  event.target.value,
                )
              }
              rows={4}
              required
            />
          </label>

          <label>
            کد پستی
            <input
              type="text"
              dir="ltr"
              value={form.postalCode}
              onChange={(event) =>
                handleChange(
                  "postalCode",
                  event.target.value,
                )
              }
              required
            />
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "16px",
            }}
          >
            <label>
              پلاک
              <input
                type="text"
                value={form.plaque ?? ""}
                onChange={(event) =>
                  handleChange(
                    "plaque",
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              واحد
              <input
                type="text"
                value={form.unit ?? ""}
                onChange={(event) =>
                  handleChange(
                    "unit",
                    event.target.value,
                  )
                }
              />
            </label>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={
                form.isDefault ?? false
              }
              onChange={(event) =>
                handleChange(
                  "isDefault",
                  event.target.checked,
                )
              }
            />

            این آدرس به عنوان آدرس پیش‌فرض باشد
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#111",
              color: "#fff",
              cursor: isSubmitting
                ? "not-allowed"
                : "pointer",
            }}
          >
            {isSubmitting
              ? "در حال ذخیره..."
              : "ذخیره آدرس"}
          </button>
        </form>
      )}

      {addresses.length === 0 ? (
        <section
          style={{
            padding: "40px",
            textAlign: "center",
            border: "1px solid #ddd",
            borderRadius: "16px",
          }}
        >
          <h2>
            هنوز آدرسی ثبت نکرده‌اید
          </h2>

          <p>
            برای ثبت اولین آدرس، روی دکمه «افزودن آدرس» کلیک کنید.
          </p>
        </section>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {addresses.map(
            (address) => (
              <article
                key={address.id}
                style={{
                  padding: "24px",
                  border: address.isDefault
                    ? "2px solid #111"
                    : "1px solid #ddd",
                  borderRadius: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                  }}
                >
                  <h2>
                    {address.title}
                  </h2>

                  {address.isDefault && (
                    <strong>
                      آدرس پیش‌فرض
                    </strong>
                  )}
                </div>

                <p>
                  گیرنده:{" "}
                  {address.recipientName}
                </p>

                <p dir="ltr">
                  {address.recipientPhone}
                </p>

                <p>
                  {address.province}،{" "}
                  {address.city}
                </p>

                <p>
                  {address.address}
                </p>

                <p>
                  پلاک:{" "}
                  {address.plaque || "-"}
                  {" | "}
                  واحد:{" "}
                  {address.unit || "-"}
                </p>

                <p>
                  کد پستی:{" "}
                  {address.postalCode}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                  }}
                >
                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() =>
                        handleDefault(
                          address.id,
                        )
                      }
                    >
                      انتخاب به عنوان پیش‌فرض
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        address.id,
                      )
                    }
                    style={{
                      color: "#b42318",
                    }}
                  >
                    حذف
                  </button>
                </div>
              </article>
            ),
          )}
        </div>
      )}
    </main>
  );
}