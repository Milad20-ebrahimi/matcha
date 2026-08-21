import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./user.schema.js";

export const userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    dateOfBirth: date("date_of_birth"),

    job: varchar("job", {
      length: 150,
    }),

    bio: text("bio"),

    avatarUrl: varchar("avatar_url", {
      length: 500,
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