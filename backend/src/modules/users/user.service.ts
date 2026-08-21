import {
  createUser,
  findDefaultUserRole,
  updateUserProfile,
} from "./user.repository.js";

import {
  createUserProfile,
} from "./user-profile.repository.js";

export async function registerUser(
  data: {
    phone: string;
    firstName: string;
  }
) {
  const firstName =
    data.firstName.trim();

  if (!firstName) {
    throw new Error(
      "نام کاربر الزامی است."
    );
  }

  const role =
    await findDefaultUserRole();

  const user = await createUser({
    roleId: role.id,
    phone: data.phone,
    firstName,
  });

  const profile =
    await createUserProfile(
      user.id
    );

  return {
    user,
    profile,
  };
}

type UpdateUserProfileInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export async function updateUserProfileService(
  userId: string,
  data: UpdateUserProfileInput
) {
  const firstName =
    data.firstName?.trim();

  const lastName =
    data.lastName?.trim();

  const email =
    data.email?.trim();

  if (
    firstName !== undefined &&
    !firstName
  ) {
    throw new Error(
      "نام نمی‌تواند خالی باشد."
    );
  }

  if (
    email !== undefined &&
    email !== ""
  ) {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(email)
    ) {
      throw new Error(
        "فرمت ایمیل صحیح نیست."
      );
    }
  }

  return updateUserProfile(
    userId,
    {
      ...(firstName !== undefined
        ? {
            firstName,
          }
        : {}),

      ...(lastName !== undefined
        ? {
            lastName:
              lastName || null,
          }
        : {}),

      ...(email !== undefined
        ? {
            email:
              email || null,
          }
        : {}),
    }
  );
}