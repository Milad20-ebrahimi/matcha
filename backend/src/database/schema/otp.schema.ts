import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const otpCodes = pgTable("otp_codes", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  phone: varchar("phone", {
    length: 20,
  }).notNull(),

  codeHash: varchar("code_hash", {
    length: 255,
  }).notNull(),

  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),

  attempts: integer("attempts")
    .default(0)
    .notNull(),

  verifiedAt: timestamp("verified_at", {
    withTimezone: true,
  }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});