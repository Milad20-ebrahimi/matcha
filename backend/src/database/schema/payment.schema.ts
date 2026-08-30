import {
  pgEnum,
  pgTable,
  uuid,
  integer,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { orders } from "./order.schema.js";

export const paymentMethodEnum = pgEnum(
  "payment_method",
  [
    "ONLINE",
    "CASH",
  ],
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    orderId: uuid("order_id")
      .notNull()
      .unique()
      .references(() => orders.id, {
        onDelete: "cascade",
      }),

    amount: integer("amount")
      .notNull(),

    status: varchar("status", {
      length: 20,
    })
      .default("PENDING")
      .notNull(),

    method: paymentMethodEnum("method")
      .default("ONLINE")
      .notNull(),

    authority: varchar("authority", {
      length: 255,
    }),

    refId: varchar("ref_id", {
      length: 255,
    }),

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
  },
);