import type {
  Payment,
  PaymentStatus,
  PaymentWithOrder,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api/v1";

type ApiResponse<T> = {
  message?: string;
  data: T;
};

async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_URL}${url}`,
    {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type":
          "application/json",
        ...(options?.headers || {}),
      },
    },
  );

  const result =
    (await response.json()) as
      | ApiResponse<T>
      | { message?: string };

  if (!response.ok) {
    throw new Error(
      result.message ||
        "خطا در ارتباط با سرور.",
    );
  }

  if (!("data" in result)) {
    throw new Error(
      "پاسخ نامعتبر از سرور دریافت شد.",
    );
  }

  return result.data;
}

/**
 * دریافت اطلاعات یک پرداخت
 */
export async function getPayment(
  paymentId: string,
): Promise<PaymentWithOrder> {
  return request<PaymentWithOrder>(
    `/payments/${paymentId}`,
  );
}

/**
 * دریافت پرداخت مربوط به یک سفارش
 */
export async function getPaymentByOrder(
  orderId: string,
): Promise<PaymentWithOrder> {
  return request<PaymentWithOrder>(
    `/payments/order/${orderId}`,
  );
}

/**
 * تغییر وضعیت پرداخت
 */
export async function updatePaymentStatus(
  paymentId: string,
  data: {
    status: PaymentStatus;
    authority?: string;
    refId?: string;
  },
): Promise<Payment> {
  return request<Payment>(
    `/payments/${paymentId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}
