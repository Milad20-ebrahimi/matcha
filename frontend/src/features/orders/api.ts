import { apiRequest } from "@/lib/api/client";

import type {
  CreateOrderInput,
  CreateOrderResponse,
  OrdersResponse,
  OrderResponse,
} from "./types";

export async function createOrder(
  data: CreateOrderInput,
): Promise<CreateOrderResponse["data"]> {
  const response =
    await apiRequest<CreateOrderResponse>(
      "/orders",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

  return response.data;
}

export async function getOrders(): Promise<
  OrdersResponse["data"]
> {
  const response =
    await apiRequest<OrdersResponse>(
      "/orders",
    );

  return response.data;
}

export async function getOrderById(
  orderId: string,
): Promise<OrderResponse["data"]> {
  const response =
    await apiRequest<OrderResponse>(
      `/orders/${orderId}`,
    );

  return response.data;
}