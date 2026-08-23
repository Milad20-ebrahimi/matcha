import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";

import { users } from "./user.schema.js";

export const addresses =
  pgTable("addresses", {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(
        () => users.id,
        {
          onDelete: "cascade",
        }
      ),

    title: varchar(
      "title",
      {
        length: 100,
      }
    ).notNull(),

    recipientName:
      varchar(
        "recipient_name",
        {
          length: 150,
        }
      ).notNull(),

    recipientPhone:
      varchar(
        "recipient_phone",
        {
          length: 20,
        }
      ).notNull(),

    province: varchar(
      "province",
      {
        length: 100,
      }
    ).notNull(),

    city: varchar(
      "city",
      {
        length: 100,
      }
    ).notNull(),

    address: text(
      "address"
    ).notNull(),

    postalCode:
      varchar(
        "postal_code",
        {
          length: 20,
        }
      ).notNull(),

    plaque: varchar(
      "plaque",
      {
        length: 20,
      }
    ),

    unit: varchar(
      "unit",
      {
        length: 20,
      }
    ),

    latitude: decimal(
      "latitude",
      {
        precision: 10,
        scale: 7,
      }
    ),

    longitude: decimal(
      "longitude",
      {
        precision: 10,
        scale: 7,
      }
    ),

    isDefault: boolean(
      "is_default"
    )
      .notNull()
      .default(false),

    createdAt:
      timestamp(
        "created_at",
        {
          withTimezone: true,
        }
      )
        .notNull()
        .defaultNow(),

    updatedAt:
      timestamp(
        "updated_at",
        {
          withTimezone: true,
        }
      )
        .notNull()
        .defaultNow(),
  });
  