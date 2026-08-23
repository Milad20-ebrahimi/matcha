export type Address = {
  id: string;
  userId: string;

  title: string;
  recipientName: string;
  recipientPhone: string;

  province: string;
  city: string;
  address: string;
  postalCode: string;

  plaque: string | null;
  unit: string | null;

  latitude: string | null;
  longitude: string | null;

  isDefault: boolean;

  createdAt: string;
  updatedAt: string;
};

export type CreateAddressInput = {
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

export type UpdateAddressInput = {
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

export type AddressesResponse = {
  message: string;
  data: Address[];
};

export type AddressResponse = {
  message: string;
  data: Address;
};