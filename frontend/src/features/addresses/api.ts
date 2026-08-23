import { apiRequest } from "@/lib/api/client";

import type {
  Address,
  AddressesResponse,
  AddressResponse,
  CreateAddressInput,
  UpdateAddressInput,
} from "./types";

export async function getAddresses(): Promise<
  Address[]
> {
  const response =
    await apiRequest<AddressesResponse>(
      "/addresses"
    );

  return response.data;
}

export async function createAddress(
  data: CreateAddressInput
): Promise<Address> {
  const response =
    await apiRequest<AddressResponse>(
      "/addresses",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

  return response.data;
}

export async function updateAddress(
  addressId: string,
  data: UpdateAddressInput
): Promise<Address> {
  const response =
    await apiRequest<AddressResponse>(
      `/addresses/${addressId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

  return response.data;
}

export async function deleteAddress(
  addressId: string
): Promise<void> {
  await apiRequest<{
    message: string;
  }>(
    `/addresses/${addressId}`,
    {
      method: "DELETE",
    }
  );
}

export async function setDefaultAddress(
  addressId: string
): Promise<Address> {
  const response =
    await apiRequest<AddressResponse>(
      `/addresses/${addressId}/default`,
      {
        method: "PATCH",
      }
    );

  return response.data;
}