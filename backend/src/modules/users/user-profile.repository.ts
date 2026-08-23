import { eq } from "drizzle-orm";

import { db } from "../../database/index.js";

import {
userProfiles,
} from "../../database/schema/user-profile.schema.js";

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

export async function findUserProfileByUserId(
userId: string
) {
const [profile] = await db
.select()
.from(userProfiles)
.where(
eq(
userProfiles.userId,
userId
)
)
.limit(1);

return profile;
}

export async function updateUserProfileData(
userId: string,
data: {
dateOfBirth?: string | null;
job?: string | null;
bio?: string | null;
avatarUrl?: string | null;
}
) {
const [profile] = await db
.update(userProfiles)
.set({
...(data.dateOfBirth !== undefined
? {
dateOfBirth:
data.dateOfBirth,
}
: {}),

  ...(data.job !== undefined
    ? {
        job:
          data.job,
      }
    : {}),

  ...(data.bio !== undefined
    ? {
        bio:
          data.bio,
      }
    : {}),

  ...(data.avatarUrl !== undefined
    ? {
        avatarUrl:
          data.avatarUrl,
      }
    : {}),

  updatedAt:
    new Date(),
})
.where(
  eq(
    userProfiles.userId,
    userId
  )
)
.returning();

if (!profile) {
throw new Error(
"User profile not found."
);
}

return profile;
}
