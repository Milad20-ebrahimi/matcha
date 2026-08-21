import { db } from "../../database/index.js";

import { userProfiles } from "../../database/schema/user-profile.schema.js";

export async function createUserProfile(
  userId: string
) {
  const [profile] = await db
    .insert(userProfiles)
    .values({
      userId,
    })
    .returning();

  if (!profile) {
    throw new Error(
      "Failed to create user profile."
    );
  }

  return profile;
}