import {
  findPaymentById,
  findPaymentByOrderId,
  findUserPaymentById,
  updatePaymentStatus,
} from "./payment.repository.js";

type CreatePaymentInput = {
  orderId: string;
  amount: number;
  method: "ONLINE" | "CASH";
};

type UpdatePaymentStatusInput = {
  status:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";

  authority?: string;
  refId?: string;
};

export async function createOrderPayment(
  data: CreatePaymentInput,
) {
  if (!data.orderId) {
    throw new Error(
      "Order ID is required.",
    );
  }

  if (
    !Number.isInteger(data.amount) ||
    data.amount <= 0
  ) {
    throw new Error(
      "Payment amount must be greater than zero.",
    );
  }

  if (
    data.method !== "ONLINE" &&
    data.method !== "CASH"
  ) {
    throw new Error(
      "Invalid payment method.",
    );
  }

  const existingPayment =
    await findPaymentByOrderId(
      data.orderId,
    );

  if (existingPayment) {
    return existingPayment;
  }

  throw new Error(
    "Payment must be created inside an order transaction.",
  );
}

export async function getPaymentById(
  paymentId: string,
) {
  if (!paymentId) {
    throw new Error(
      "Payment ID is required.",
    );
  }

  const payment =
    await findPaymentById(
      paymentId,
    );

  if (!payment) {
    throw new Error(
      "Payment not found.",
    );
  }

  return payment;
}

export async function getPaymentByOrderId(
  orderId: string,
) {
  if (!orderId) {
    throw new Error(
      "Order ID is required.",
    );
  }

  const payment =
    await findPaymentByOrderId(
      orderId,
    );

  if (!payment) {
    throw new Error(
      "Payment not found.",
    );
  }

  return payment;
}

export async function getUserPayment(
  paymentId: string,
  userId: string,
) {
  if (!paymentId) {
    throw new Error(
      "Payment ID is required.",
    );
  }

  if (!userId) {
    throw new Error(
      "User ID is required.",
    );
  }

  const result =
    await findUserPaymentById(
      paymentId,
      userId,
    );

  if (!result) {
    throw new Error(
      "Payment not found.",
    );
  }

  return result;
}

export async function changePaymentStatus(
  paymentId: string,
  data: UpdatePaymentStatusInput,
) {
  if (!paymentId) {
    throw new Error(
      "Payment ID is required.",
    );
  }

  const payment =
    await findPaymentById(
      paymentId,
    );

  if (!payment) {
    throw new Error(
      "Payment not found.",
    );
  }

  if (payment.status === "REFUNDED") {
    throw new Error(
      "A refunded payment cannot be changed.",
    );
  }

  if (
    payment.status === "PAID" &&
    data.status === "PENDING"
  ) {
    throw new Error(
      "A paid payment cannot return to pending.",
    );
  }

  if (
    payment.status === "PAID" &&
    data.status === "FAILED"
  ) {
    throw new Error(
      "A paid payment cannot be marked as failed.",
    );
  }

  if (
    payment.status === "FAILED" &&
    data.status === "PENDING"
  ) {
    throw new Error(
      "A failed payment cannot return to pending.",
    );
  }

  const updatedPayment =
    await updatePaymentStatus(
      paymentId,
      data.status,
      {
        ...(data.authority !== undefined
          ? {
              authority:
                data.authority,
            }
          : {}),

        ...(data.refId !== undefined
          ? {
              refId:
                data.refId,
            }
          : {}),
      },
    );

  if (!updatedPayment) {
    throw new Error(
      "Failed to update payment.",
    );
  }

  return updatedPayment;
}