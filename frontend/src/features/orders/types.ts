export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  createdAt: string;
};

export type PaymentMethod =
  | "ONLINE"
  | "CASH";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

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

  paymentStatus: PaymentStatus;

  totalAmount: number;

  shippingAddress: string;

  createdAt: string;
  updatedAt: string;

  items: OrderItem[];
};

export type CreateOrderInput = {
  shippingAddress: string;

  paymentMethod: PaymentMethod;
};

export type CreateOrderResponse = {
  message: string;

  data: {
    order: Order;

    payment: {
      id: string;
      orderId: string;
      amount: number;

      status: PaymentStatus;

      method: PaymentMethod;

      authority?: string | null;

      refId?: string | null;

      createdAt: string;
      updatedAt: string;
    };

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