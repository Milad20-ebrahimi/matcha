import {
  clearDefaultAddresses,
  createAddress,
  deleteAddress,
  findAddressById,
  findAddressesByUserId,
  setAddressAsDefault,
  updateAddress,
} from "./address.repository.js";

type CreateAddressInput = {
  title: string;
  recipientName: string;
  recipientPhone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  plaque?: string | null;
  unit?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  isDefault?: boolean;
};

type UpdateAddressInput = {
  title?: string;
  recipientName?: string;
  recipientPhone?: string;
  province?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  plaque?: string | null;
  unit?: string | null;
  latitude?: string | null;
  longitude?: string | null;
};

function validateRequiredString(
  value: unknown,
  fieldName: string,
) {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error(
      `${fieldName} الزامی است.`,
    );
  }
}

function validatePhone(
  phone: string,
) {
  const normalized =
    phone.trim();

  if (
    !/^09\d{9}$/.test(
      normalized,
    )
  ) {
    throw new Error(
      "شماره موبایل گیرنده معتبر نیست.",
    );
  }

  return normalized;
}

function validatePostalCode(
  postalCode: string,
) {
  const normalized =
    postalCode.trim();

  if (
    !/^\d{10}$/.test(
      normalized,
    )
  ) {
    throw new Error(
      "کد پستی باید ۱۰ رقم باشد.",
    );
  }

  return normalized;
}

export async function getUserAddresses(
  userId: string,
) {
  return findAddressesByUserId(
    userId,
  );
}

export async function createUserAddress(
  userId: string,
  data: CreateAddressInput,
) {
  validateRequiredString(
    data.title,
    "عنوان آدرس",
  );

  validateRequiredString(
    data.recipientName,
    "نام گیرنده",
  );

  validateRequiredString(
    data.province,
    "استان",
  );

  validateRequiredString(
    data.city,
    "شهر",
  );

  validateRequiredString(
    data.address,
    "آدرس",
  );

  const recipientPhone =
    validatePhone(
      data.recipientPhone,
    );

  const postalCode =
    validatePostalCode(
      data.postalCode,
    );

  if (data.isDefault) {
    await clearDefaultAddresses(
      userId,
    );
  }

  return createAddress({
    userId,

    title:
      data.title.trim(),

    recipientName:
      data.recipientName.trim(),

    recipientPhone,

    province:
      data.province.trim(),

    city:
      data.city.trim(),

    address:
      data.address.trim(),

    postalCode,

    plaque:
      data.plaque?.trim() ||
      null,

    unit:
      data.unit?.trim() ||
      null,

    latitude:
      data.latitude ?? null,

    longitude:
      data.longitude ?? null,

    isDefault:
      data.isDefault ?? false,
  });
}

export async function updateUserAddress(
  userId: string,
  addressId: string,
  data: UpdateAddressInput,
) {
  const existingAddress =
    await findAddressById(
      addressId,
      userId,
    );

  if (!existingAddress) {
    throw new Error(
      "آدرس پیدا نشد.",
    );
  }

  if (
    data.title !== undefined
  ) {
    validateRequiredString(
      data.title,
      "عنوان آدرس",
    );
  }

  if (
    data.recipientName !==
    undefined
  ) {
    validateRequiredString(
      data.recipientName,
      "نام گیرنده",
    );
  }

  if (
    data.province !== undefined
  ) {
    validateRequiredString(
      data.province,
      "استان",
    );
  }

  if (
    data.city !== undefined
  ) {
    validateRequiredString(
      data.city,
      "شهر",
    );
  }

  if (
    data.address !== undefined
  ) {
    validateRequiredString(
      data.address,
      "آدرس",
    );
  }

  const recipientPhone =
    data.recipientPhone !==
    undefined
      ? validatePhone(
          data.recipientPhone,
        )
      : undefined;

  const postalCode =
    data.postalCode !==
    undefined
      ? validatePostalCode(
          data.postalCode,
        )
      : undefined;

  return updateAddress(
    addressId,
    userId,
    {
      ...(data.title !==
      undefined
        ? {
            title:
              data.title.trim(),
          }
        : {}),

      ...(data.recipientName !==
      undefined
        ? {
            recipientName:
              data.recipientName.trim(),
          }
        : {}),

      ...(recipientPhone !==
      undefined
        ? {
            recipientPhone,
          }
        : {}),

      ...(data.province !==
      undefined
        ? {
            province:
              data.province.trim(),
          }
        : {}),

      ...(data.city !==
      undefined
        ? {
            city:
              data.city.trim(),
          }
        : {}),

      ...(data.address !==
      undefined
        ? {
            address:
              data.address.trim(),
          }
        : {}),

      ...(postalCode !==
      undefined
        ? {
            postalCode,
          }
        : {}),

      ...(data.plaque !==
      undefined
        ? {
            plaque:
              data.plaque?.trim() ||
              null,
          }
        : {}),

      ...(data.unit !==
      undefined
        ? {
            unit:
              data.unit?.trim() ||
              null,
          }
        : {}),

      ...(data.latitude !==
      undefined
        ? {
            latitude:
              data.latitude,
          }
        : {}),

      ...(data.longitude !==
      undefined
        ? {
            longitude:
              data.longitude,
          }
        : {}),
    },
  );
}

export async function deleteUserAddress(
  userId: string,
  addressId: string,
) {
  const existingAddress =
    await findAddressById(
      addressId,
      userId,
    );

  if (!existingAddress) {
    throw new Error(
      "آدرس پیدا نشد.",
    );
  }

  return deleteAddress(
    addressId,
    userId,
  );
}

export async function setDefaultUserAddress(
  userId: string,
  addressId: string,
) {
  const existingAddress =
    await findAddressById(
      addressId,
      userId,
    );

  if (!existingAddress) {
    throw new Error(
      "آدرس پیدا نشد.",
    );
  }

  return setAddressAsDefault(
    addressId,
    userId,
  );
}