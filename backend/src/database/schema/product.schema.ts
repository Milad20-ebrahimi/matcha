import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

import { categories } from "./category.schema.js";
import { brands } from "./brand.schema.js";

export const products = pgTable("products", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),

  brandId: uuid("brand_id")
    .references(() => brands.id),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  slug: varchar("slug", {
    length: 255,
  })
    .notNull()
    .unique(),

  description: text("description"),

  price: integer("price")
    .notNull(),

  stock: integer("stock")
    .default(0)
    .notNull(),

  image: text("image"),

  isActive: boolean("is_active")
    .default(true)
    .notNull(),

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