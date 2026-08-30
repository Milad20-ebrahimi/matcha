import {
  and,
  eq,
} from "drizzle-orm";

import { db } from "../../database/index.js";

import {
  orders,
  orderItems,
} from "../../database/schema/index.js";

type Transaction = Parameters<
  typeof db.transaction
>[0] extends (
  tx: infer T,
) => unknown
  ? T
  : never;

export async function createOrder(
  tx: Transaction,
  data: {
    userId: string;
    totalAmount: number;
    shippingAddress: string;
  },
) {
  const [order] =
    await tx
      .insert(orders)
      .values({
        userId: data.userId,
        totalAmount:
          data.totalAmount,
        shippingAddress:
          data.shippingAddress,
      })
      .returning();

  if (!order) {
    throw new Error(
      "Failed to create order.",
    );
  }

  return order;
}

export async function createOrderItems(
  tx: Transaction,
  items: {
    orderId: string;
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
  }[],
) {
  if (items.length === 0) {
    return [];
  }

  return tx
    .insert(orderItems)
    .values(items)
    .returning();
}

export async function findOrdersByUserId(
  userId: string,
) {
  const userOrders =
    await db
      .select()
      .from(orders)
      .where(
        eq(
          orders.userId,
          userId,
        ),
      )
      .orderBy(
        orders.createdAt,
      );

  if (userOrders.length === 0) {
    return [];
  }

  const ordersWithItems =
    await Promise.all(
      userOrders.map(
        async (order) => {
          const items =
            await findOrderItems(
              order.id,
            );

          return {
            ...order,
            items,
          };
        },
      ),
    );

  return ordersWithItems;
}

export async function findOrderById(
  orderId: string,
  userId: string,
) {
  const [order] =
    await db
      .select()
      .from(orders)
      .where(
        and(
          eq(
            orders.id,
            orderId,
          ),
          eq(
            orders.userId,
            userId,
          ),
        ),
      )
      .limit(1);

  return order;
}

export async function findOrderItems(
  orderId: string,
) {
  return db
    .select()
    .from(orderItems)
    .where(
      eq(
        orderItems.orderId,
        orderId,
      ),
    );
}