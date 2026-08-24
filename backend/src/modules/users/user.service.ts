import {
  createUser,
  findDefaultUserRole,
  updateUserProfile,
} from "./user.repository.js";

import {
  createUserProfile,
  updateUserProfileData,
} from "./user-profile.repository.js";

export async function registerUser(
  data: {
    phone: string;
    firstName: string;
  }
) {
  const firstName = data.firstName.trim();

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

  dateOfBirth?: string | null;
  job?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
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

  const job =
    data.job?.trim();

  const bio =
    data.bio?.trim();

  const avatarUrl =
    data.avatarUrl?.trim();

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

  if (
    data.dateOfBirth !== undefined &&
    data.dateOfBirth !== null &&
    data.dateOfBirth !== ""
  ) {
    const date =
      new Date(
        data.dateOfBirth
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      throw new Error(
        "تاریخ تولد معتبر نیست."
      );
    }
  }

  const user =
    await updateUserProfile(
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

  const profile =
    await updateUserProfileData(
      userId,
      {
        ...(data.dateOfBirth !== undefined
          ? {
              dateOfBirth:
                data.dateOfBirth || null,
            }
          : {}),

        ...(job !== undefined
          ? {
              job:
                job || null,
            }
          : {}),

        ...(bio !== undefined
          ? {
              bio:
                bio || null,
            }
          : {}),

        ...(avatarUrl !== undefined
          ? {
              avatarUrl:
                avatarUrl || null,
            }
          : {}),
      }
    );

  return {
    user,
    profile,
  };
}