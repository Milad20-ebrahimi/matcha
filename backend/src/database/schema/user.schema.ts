import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

import { roles } from "./role.schema.js";

export const users = pgTable("users", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  roleId: uuid("role_id")
    .notNull()
    .references(() => roles.id),

  firstName: varchar("first_name", {
    length: 100,
  }),

  lastName: varchar("last_name", {
    length: 100,
  }),

  email: varchar("email", {
    length: 255,
  }).unique(),

  phone: varchar("phone", {
    length: 20,
  }).unique(),

  passwordHash: varchar("password_hash", {
    length: 255,
  }),

  isActive: boolean("is_active")
    .default(true)
    .notNull(),

  emailVerified: boolean("email_verified")
    .default(false)
    .notNull(),

  phoneVerified: boolean("phone_verified")
    .default(false)
    .notNull(),

  lastLoginAt: timestamp(
    "last_login_at",
    {
      withTimezone: true,
    },
  ),

  createdAt: timestamp(
    "created_at",
    {
      withTimezone: true,
    },
  )
    .defaultNow()
    .notNull(),

  updatedAt: timestamp(
    "updated_at",
    {
      withTimezone: true,
    },
  )
    .defaultNow()
    .notNull(),
});