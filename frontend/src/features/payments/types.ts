export type PaymentMethod =
  | "ONLINE"
  | "CASH";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type Payment = {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus | string;
  method: PaymentMethod;
  authority?: string | null;
  refId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaymentWithOrder = {
  payment: Payment;
  order: {
    id: string;
    userId: string;
    status: string;
    paymentStatus: PaymentStatus;
    totalAmount: number;
    shippingAddress: string | null;
    createdAt: string;
    updatedAt: string;
  };
};
