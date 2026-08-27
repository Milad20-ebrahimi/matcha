import {
  and,
  desc,
  eq,
} from "drizzle-orm";

import { db } from "../../database/index.js";
import { addresses } from "../../database/schema/address.schema.js";

export async function findAddressesByUserId(
  userId: string,
) {
  return db
    .select()
    .from(addresses)
    .where(
      eq(
        addresses.userId,
        userId,
      ),
    )
    .orderBy(
      desc(addresses.isDefault),
      desc(addresses.createdAt),
    );
}

export async function findAddressById(
  addressId: string,
  userId: string,
) {
  const [address] =
    await db
      .select()
      .from(addresses)
      .where(
        and(
          eq(
            addresses.id,
            addressId,
          ),
          eq(
            addresses.userId,
            userId,
          ),
        ),
      )
      .limit(1);

  return address;
}

export async function createAddress(
  data: {
    userId: string;
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
  },
) {
  const [newAddress] =
    await db
      .insert(addresses)
      .values({
        userId: data.userId,
        title: data.title,
        recipientName:
          data.recipientName,
        recipientPhone:
          data.recipientPhone,
        province:
          data.province,
        city:
          data.city,
        address:
          data.address,
        postalCode:
          data.postalCode,
        plaque:
          data.plaque ?? null,
        unit:
          data.unit ?? null,
        latitude:
          data.latitude ?? null,
        longitude:
          data.longitude ?? null,
        isDefault:
          data.isDefault ?? false,
      })
      .returning();

  if (!newAddress) {
    throw new Error(
      "Failed to create address.",
    );
  }

  return newAddress;
}

export async function updateAddress(
  addressId: string,
  userId: string,
  data: {
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
  },
) {
  const [updatedAddress] =
    await db
      .update(addresses)
      .set({
        ...data,
        updatedAt:
          new Date(),
      })
      .where(
        and(
          eq(
            addresses.id,
            addressId,
          ),
          eq(
            addresses.userId,
            userId,
          ),
        ),
      )
      .returning();

  if (!updatedAddress) {
    throw new Error(
      "Address not found.",
    );
  }

  return updatedAddress;
}

export async function deleteAddress(
  addressId: string,
  userId: string,
) {
  const [deletedAddress] =
    await db
      .delete(addresses)
      .where(
        and(
          eq(
            addresses.id,
            addressId,
          ),
          eq(
            addresses.userId,
            userId,
          ),
        ),
      )
      .returning();

  if (!deletedAddress) {
    throw new Error(
      "Address not found.",
    );
  }

  return deletedAddress;
}

export async function clearDefaultAddresses(
  userId: string,
) {
  await db
    .update(addresses)
    .set({
      isDefault: false,
      updatedAt:
        new Date(),
    })
    .where(
      eq(
        addresses.userId,
        userId,
      ),
    );
}

export async function setAddressAsDefault(
  addressId: string,
  userId: string,
) {
  await clearDefaultAddresses(
    userId,
  );

  const [address] =
    await db
      .update(addresses)
      .set({
        isDefault: true,
        updatedAt:
          new Date(),
      })
      .where(
        and(
          eq(
            addresses.id,
            addressId,
          ),
          eq(
            addresses.userId,
            userId,
          ),
        ),
      )
      .returning();

  if (!address) {
    throw new Error(
      "Address not found.",
    );
  }

  return address;
}