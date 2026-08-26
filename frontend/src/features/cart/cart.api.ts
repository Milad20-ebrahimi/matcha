import { apiRequest } from "@/lib/api/client";

import type {
  Cart,
} from "./types";

type CartResponse = {
  success: boolean;
  data: Cart;
};

type CartItemResponse = {
  success: boolean;
  message: string;
  data: Cart["items"][number];
};

export async function getCart(): Promise<CartResponse> {
  return apiRequest<CartResponse>("/cart", {
    method: "GET",
  });
}

export async function addCartItem(
  productId: string,
  quantity: number,
): Promise<CartItemResponse> {
  return apiRequest<CartItemResponse>(
    "/cart/items",
    {
      method: "POST",
      body: JSON.stringify({
        productId,
        quantity,
      }),
    },
  );
}

export async function updateCartItem(
  productId: string,
  quantity: number,
): Promise<CartItemResponse> {
  return apiRequest<CartItemResponse>(
    `/cart/items/${productId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        quantity,
      }),
    },
  );
}

export async function removeCartItem(
  productId: string,
): Promise<{
  success: boolean;
  message: string;
}> {
  return apiRequest(
    `/cart/items/${productId}`,
    {
      method: "DELETE",
    },
  );
}

export async function clearCart(): Promise<{
  success: boolean;
  message: string;
}> {
  return apiRequest(
    "/cart",
    {
      method: "DELETE",
    },
  );
}