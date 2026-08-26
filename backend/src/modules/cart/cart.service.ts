import {
  createCart,
  createCartItem,
  deleteAllCartItems,
  deleteCartItem,
  findCartByUserId,
  findCartItem,
  findCartItems,
  findProduct,
  updateCartItemQuantity,
} from "./cart.repository.js";

async function getOrCreateCart(
  userId: string,
) {
  const existingCart =
    await findCartByUserId(userId);

  if (existingCart) {
    return existingCart;
  }

  return createCart(userId);
}

export async function getUserCart(
  userId: string,
) {
  const cart =
    await getOrCreateCart(userId);

  const items =
    await findCartItems(cart.id);

  return {
    id: cart.id,
    userId: cart.userId,
    items,
  };
}

export async function addItemToCart(
  userId: string,
  productId: string,
  quantity: number,
) {
  if (
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    throw new Error(
      "تعداد محصول باید یک عدد صحیح بزرگ‌تر از صفر باشد.",
    );
  }

  const product =
    await findProduct(productId);

  if (!product) {
    throw new Error(
      "محصول پیدا نشد.",
    );
  }

  if (!product.isActive) {
    throw new Error(
      "این محصول در حال حاضر فعال نیست.",
    );
  }

  if (product.stock <= 0) {
    throw new Error(
      "این محصول ناموجود است.",
    );
  }

  const cart =
    await getOrCreateCart(userId);

  const existingItem =
    await findCartItem(
      cart.id,
      productId,
    );

  if (existingItem) {
    const newQuantity =
      existingItem.quantity +
      quantity;

    if (
      newQuantity >
      product.stock
    ) {
      throw new Error(
        `حداکثر موجودی این محصول ${product.stock} عدد است.`,
      );
    }

    return updateCartItemQuantity(
      existingItem.id,
      newQuantity,
    );
  }

  if (
    quantity >
    product.stock
  ) {
    throw new Error(
      `حداکثر موجودی این محصول ${product.stock} عدد است.`,
    );
  }

  return createCartItem({
    cartId: cart.id,
    productId,
    quantity,
  });
}

export async function updateCartItem(
  userId: string,
  productId: string,
  quantity: number,
) {
  if (
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    throw new Error(
      "تعداد محصول باید یک عدد صحیح بزرگ‌تر از صفر باشد.",
    );
  }

  const product =
    await findProduct(productId);

  if (!product) {
    throw new Error(
      "محصول پیدا نشد.",
    );
  }

  if (
    quantity >
    product.stock
  ) {
    throw new Error(
      `حداکثر موجودی این محصول ${product.stock} عدد است.`,
    );
  }

  const cart =
    await getOrCreateCart(userId);

  const item =
    await findCartItem(
      cart.id,
      productId,
    );

  if (!item) {
    throw new Error(
      "این محصول در سبد خرید وجود ندارد.",
    );
  }

  return updateCartItemQuantity(
    item.id,
    quantity,
  );
}

export async function removeItemFromCart(
  userId: string,
  productId: string,
) {
  const cart =
    await findCartByUserId(userId);

  if (!cart) {
    return;
  }

  const item =
    await findCartItem(
      cart.id,
      productId,
    );

  if (!item) {
    return;
  }

  await deleteCartItem(item.id);
}

export async function clearUserCart(
  userId: string,
) {
  const cart =
    await findCartByUserId(userId);

  if (!cart) {
    return;
  }

  await deleteAllCartItems(
    cart.id,
  );
}