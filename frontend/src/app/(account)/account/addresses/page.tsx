"use client";

import {
  useAddressContext,
} from "@/features/addresses/address.context";

export default function AddressesPage() {
  const {
    addresses,
    isLoading,
    error,
  } = useAddressContext();

  if (isLoading) {
    return (
      <main dir="rtl">
        <h1>آدرس‌های من</h1>
        <p>در حال دریافت آدرس‌ها...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main dir="rtl">
        <h1>آدرس‌های من</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main dir="rtl">
      <h1>آدرس‌های من</h1>

      {addresses.length === 0 ? (
        <p>
          هنوز آدرسی ثبت نکرده‌اید.
        </p>
      ) : (
        <div>
          {addresses.map(
            (address) => (
              <div
                key={address.id}
              >
                <h2>
                  {address.title}
                </h2>

                <p>
                  {address.province}،{" "}
                  {address.city}
                </p>

                <p>
                  {address.address}
                </p>

                <p>
                  پلاک:{" "}
                  {address.plaque ||
                    "-"}
                </p>

                <p>
                  واحد:{" "}
                  {address.unit ||
                    "-"}
                </p>

                <p>
                  کد پستی:{" "}
                  {address.postalCode}
                </p>

                {address.isDefault && (
                  <strong>
                    آدرس پیش‌فرض
                  </strong>
                )}
              </div>
            )
          )}
        </div>
      )}
    </main>
  );
}