import {
  pgEnum,
  pgTable,
  uuid,
  integer,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./user.schema.js";
import { products } from "./product.schema.js";

export const orderStatusEnum =
  pgEnum("order_status", [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]);

export const paymentStatusEnum =
  pgEnum("payment_status", [
    "PENDING",
    "PAID",
    "FAILED",
    "REFUNDED",
  ]);

export const orders = pgTable("orders", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "restrict",
    }),

  status: orderStatusEnum("status")
    .default("PENDING")
    .notNull(),

  paymentStatus: paymentStatusEnum(
    "payment_status",
  )
    .default("PENDING")
    .notNull(),

  totalAmount: integer("total_amount")
    .notNull(),

  shippingAddress: text(
    "shipping_address",
  ),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
      }),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "restrict",
      }),

    productName: varchar(
      "product_name",
      {
        length: 255,
      },
    ).notNull(),

    productPrice: integer(
      "product_price",
    ).notNull(),

    quantity: integer("quantity")
      .notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
);