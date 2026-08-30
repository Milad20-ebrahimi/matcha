import {
  db,
} from "../../database/index.js";

import {
  cartItems,
  products,
  payments,
} from "../../database/schema/index.js";

import {
  eq,
} from "drizzle-orm";

import {
  findCartByUserId,
} from "../cart/cart.repository.js";

import {
  createOrder,
  createOrderItems,
  findOrdersByUserId,
  findOrderById,
  findOrderItems,
} from "./order.repository.js";

type CreateOrderInput = {
  shippingAddress: string;
  paymentMethod: "ONLINE" | "CASH";
};

export async function createUserOrder(
  userId: string,
  data: CreateOrderInput,
) {
  if (
    typeof data.shippingAddress !==
      "string" ||
    !data.shippingAddress.trim()
  ) {
    throw new Error(
      "آدرس ارسال الزامی است.",
    );
  }

  if (
    data.paymentMethod !== "ONLINE" &&
    data.paymentMethod !== "CASH"
  ) {
    throw new Error(
      "روش پرداخت نامعتبر است.",
    );
  }

  const cart =
    await findCartByUserId(userId);

  if (!cart) {
    throw new Error(
      "سبد خرید پیدا نشد.",
    );
  }

  return db.transaction(
    async (tx) => {
      const items =
        await tx
          .select({
            id: cartItems.id,

            productId:
              cartItems.productId,

            quantity:
              cartItems.quantity,

            product: {
              id: products.id,
              name: products.name,
              price: products.price,
              stock: products.stock,
              isActive:
                products.isActive,
            },
          })
          .from(cartItems)
          .innerJoin(
            products,
            eq(
              cartItems.productId,
              products.id,
            ),
          )
          .where(
            eq(
              cartItems.cartId,
              cart.id,
            ),
          );

      if (items.length === 0) {
        throw new Error(
          "سبد خرید شما خالی است.",
        );
      }

      let totalAmount = 0;

      const orderItemsData =
        items.map((item) => {
          if (!item.product.isActive) {
            throw new Error(
              `محصول ${item.product.name} در حال حاضر فعال نیست.`,
            );
          }

          if (
            item.quantity >
            item.product.stock
          ) {
            throw new Error(
              `موجودی محصول ${item.product.name} کافی نیست.`,
            );
          }

          totalAmount +=
            item.product.price *
            item.quantity;

          return {
            productId:
              item.product.id,

            productName:
              item.product.name,

            productPrice:
              item.product.price,

            quantity:
              item.quantity,
          };
        });

      if (totalAmount <= 0) {
        throw new Error(
          "مبلغ سفارش نامعتبر است.",
        );
      }

      const order =
        await createOrder(
          tx,
          {
            userId,

            totalAmount,

            shippingAddress:
              data.shippingAddress.trim(),
          },
        );

      await createOrderItems(
        tx,
        orderItemsData.map(
          (item) => ({
            orderId:
              order.id,

            productId:
              item.productId,

            productName:
              item.productName,

            productPrice:
              item.productPrice,

            quantity:
              item.quantity,
          }),
        ),
      );

      const [
        payment,
      ] = await tx
        .insert(payments)
        .values({
          orderId:
            order.id,

          amount:
            totalAmount,

          method:
            data.paymentMethod,

          status:
            "PENDING",
        })
        .returning();

      if (!payment) {
        throw new Error(
          "خطا در ایجاد پرداخت.",
        );
      }

      await tx
        .delete(cartItems)
        .where(
          eq(
            cartItems.cartId,
            cart.id,
          ),
        );

      return {
        order,

        payment,

        items:
          orderItemsData,
      };
    },
  );
}

/**
 * دریافت لیست سفارش‌های کاربر
 */
export async function getUserOrders(
  userId: string,
) {
  return findOrdersByUserId(
    userId,
  );
}

/**
 * دریافت یک سفارش به همراه آیتم‌های آن
 */
export async function getUserOrderById(
  orderId: string,
  userId: string,
) {
  const order =
    await findOrderById(
      orderId,
      userId,
    );

  if (!order) {
    return null;
  }

  const items =
    await findOrderItems(
      order.id,
    );

  return {
    ...order,
    items,
  };
}