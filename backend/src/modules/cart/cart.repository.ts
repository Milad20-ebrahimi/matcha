import {
  and,
  eq,
} from "drizzle-orm";

import { db } from "../../database/index.js";

import {
  carts,
  cartItems,
  products,
} from "../../database/schema/index.js";

export async function findCartByUserId(
  userId: string,
) {
  const [cart] =
    await db
      .select()
      .from(carts)
      .where(
        eq(
          carts.userId,
          userId,
        ),
      )
      .limit(1);

  return cart;
}

export async function createCart(
  userId: string,
) {
  const [cart] =
    await db
      .insert(carts)
      .values({
        userId,
      })
      .returning();

  if (!cart) {
    throw new Error(
      "Failed to create cart.",
    );
  }

  return cart;
}

export async function findCartItems(
  cartId: string,
) {
  return db
    .select({
      id: cartItems.id,
      productId:
        cartItems.productId,
      quantity:
        cartItems.quantity,

      product: {
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        stock: products.stock,
        image: products.image,
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
        cartId,
      ),
    );
}

export async function findCartItem(
  cartId: string,
  productId: string,
) {
  const [item] =
    await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(
            cartItems.cartId,
            cartId,
          ),
          eq(
            cartItems.productId,
            productId,
          ),
        ),
      )
      .limit(1);

  return item;
}

export async function findProduct(
  productId: string,
) {
  const [product] =
    await db
      .select()
      .from(products)
      .where(
        eq(
          products.id,
          productId,
        ),
      )
      .limit(1);

  return product;
}

export async function createCartItem(
  data: {
    cartId: string;
    productId: string;
    quantity: number;
  },
) {
  const [item] =
    await db
      .insert(cartItems)
      .values(data)
      .returning();

  if (!item) {
    throw new Error(
      "Failed to create cart item.",
    );
  }

  return item;
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
) {
  const [item] =
    await db
      .update(cartItems)
      .set({
        quantity,
        updatedAt: new Date(),
      })
      .where(
        eq(
          cartItems.id,
          cartItemId,
        ),
      )
      .returning();

  if (!item) {
    throw new Error(
      "Cart item not found.",
    );
  }

  return item;
}

export async function deleteCartItem(
  cartItemId: string,
) {
  const [item] =
    await db
      .delete(cartItems)
      .where(
        eq(
          cartItems.id,
          cartItemId,
        ),
      )
      .returning();

  return item;
}

export async function deleteAllCartItems(
  cartId: string,
) {
  await db
    .delete(cartItems)
    .where(
      eq(
        cartItems.cartId,
        cartId,
      ),
    );
}