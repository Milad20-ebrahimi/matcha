import {
  and,
  eq,
} from "drizzle-orm";

import { db } from "../../database/index.js";

import {
  payments,
  orders,
} from "../../database/schema/index.js";

type Transaction = Parameters<
  typeof db.transaction
>[0] extends (
  tx: infer T,
) => unknown
  ? T
  : never;

export async function createPayment(
  tx: Transaction,
  data: {
    orderId: string;
    amount: number;
    method: "ONLINE" | "CASH";
  },
) {
  const [payment] =
    await tx
      .insert(payments)
      .values({
        orderId: data.orderId,
        amount: data.amount,
        method: data.method,
        status: "PENDING",
      })
      .returning();

  if (!payment) {
    throw new Error(
      "Failed to create payment.",
    );
  }

  return payment;
}

export async function findPaymentByOrderId(
  orderId: string,
) {
  const [payment] =
    await db
      .select()
      .from(payments)
      .where(
        eq(
          payments.orderId,
          orderId,
        ),
      )
      .limit(1);

  return payment;
}

export async function findPaymentById(
  paymentId: string,
) {
  const [payment] =
    await db
      .select()
      .from(payments)
      .where(
        eq(
          payments.id,
          paymentId,
        ),
      )
      .limit(1);

  return payment;
}

export async function updatePaymentStatus(
  paymentId: string,
  status:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED",
  data?: {
    authority?: string;
    refId?: string;
  },
) {
  const [payment] =
    await db
      .update(payments)
      .set({
        status,

        ...(data?.authority !==
        undefined
          ? {
              authority:
                data.authority,
            }
          : {}),

        ...(data?.refId !==
        undefined
          ? {
              refId:
                data.refId,
            }
          : {}),

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          payments.id,
          paymentId,
        ),
      )
      .returning();

  return payment;
}

export async function findUserPaymentById(
  paymentId: string,
  userId: string,
) {
  const [payment] =
    await db
      .select({
        payment: payments,
        order: orders,
      })
      .from(payments)
      .innerJoin(
        orders,
        eq(
          payments.orderId,
          orders.id,
        ),
      )
      .where(
        and(
          eq(
            payments.id,
            paymentId,
          ),
          eq(
            orders.userId,
            userId,
          ),
        ),
      )
      .limit(1);

  return payment;
}
