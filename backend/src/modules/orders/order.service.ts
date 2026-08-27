import {
  db,
} from "../../database/index.js";

import {
  cartItems,
  products,
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
} from "./order.repository.js";

type CreateOrderInput = {
  shippingAddress: string;
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
          if (
            !item.product.isActive
          ) {
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
            orderId: order.id,
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
        items:
          orderItemsData,
      };
    },
  );
}
