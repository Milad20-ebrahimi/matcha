export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  createdAt: string;
};

export type Order = {
  id: string;
  userId: string;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";

  totalAmount: number;
  shippingAddress: string;

  createdAt: string;
  updatedAt: string;

  items: OrderItem[];
};

export type CreateOrderInput = {
  shippingAddress: string;
};

export type CreateOrderResponse = {
  message: string;

  data: {
    order: Order;

    items: Omit<
      OrderItem,
      "id" | "orderId" | "createdAt"
    >[];
  };
};

export type OrdersResponse = {
  message: string;
  data: Order[];
};

export type OrderResponse = {
  message: string;
  data: Order;
};
