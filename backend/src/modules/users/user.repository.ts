import { eq } from "drizzle-orm";

import { db } from "../../database/index.js";
import { users } from "../../database/schema/user.schema.js";
import { roles } from "../../database/schema/role.schema.js";

export async function findUserByPhone(
  phone: string
) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.phone, phone))
    .limit(1);

  return user;
}

export async function createUser(data: {
  roleId: string;
  phone: string;
  firstName?: string;
}) {
  const [user] = await db
    .insert(users)
    .values({
      roleId: data.roleId,
      phone: data.phone,
      firstName:
        data.firstName ?? null,
      phoneVerified: true,
    })
    .returning();

  if (!user) {
    throw new Error(
      "Failed to create user."
    );
  }

  return user;
}

export async function updateUserLogin(
  userId: string
) {
  const [user] = await db
    .update(users)
    .set({
      lastLoginAt: new Date(),
      phoneVerified: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  return user;
}

export async function findDefaultUserRole() {
  const [role] = await db
    .select()
    .from(roles)
    .where(
      eq(
        roles.name,
        "CUSTOMER"
      )
    )
    .limit(1);

  if (!role) {
    throw new Error(
      "Default user role not found."
    );
  }

  return role;
}

export async function findUserById(
  userId: string
) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user;
}

/**
 * بروزرسانی اطلاعات پروفایل کاربر
 *
 * شماره موبایل عمداً در این تابع
 * قابل تغییر نیست.
 */
export async function updateUserProfile(
  userId: string,
  data: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  }
) {
  const [user] = await db
    .update(users)
    .set({
      ...(data.firstName !== undefined
        ? {
            firstName:
              data.firstName,
          }
        : {}),

      ...(data.lastName !== undefined
        ? {
            lastName:
              data.lastName,
          }
        : {}),

      ...(data.email !== undefined
        ? {
            email:
              data.email,
          }
        : {}),

      updatedAt: new Date(),
    })
    .where(
      eq(
        users.id,
        userId
      )
    )
    .returning();

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  return user;
}