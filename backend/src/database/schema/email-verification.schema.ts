import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const emailVerificationCodes =
  pgTable("email_verification_codes", {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    email: varchar("email", {
      length: 255,
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