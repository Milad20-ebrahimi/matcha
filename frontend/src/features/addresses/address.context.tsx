"use client";

import { useAuthContext } from "@/features/auth/auth.context";

import {
createContext,
useCallback,
useContext,
useEffect,
useState,
} from "react";

import {
createAddress,
deleteAddress,
getAddresses,
setDefaultAddress,
updateAddress,
} from "./api";

import type {
Address,
CreateAddressInput,
UpdateAddressInput,
} from "./types";

type AddressContextValue = {
addresses: Address[];
isLoading: boolean;
error: string | null;

fetchAddresses: () => Promise<void>;

addAddress: (
data: CreateAddressInput,
) => Promise<Address>;

editAddress: (
addressId: string,
data: UpdateAddressInput,
) => Promise<Address>;

removeAddress: (
addressId: string,
) => Promise<void>;

makeDefault: (
addressId: string,
) => Promise<Address>;
};

const AddressContext =
createContext<
AddressContextValue | undefined

> (undefined);

export function AddressProvider({
children,
}: {
children: React.ReactNode;
}) {
const [
addresses,
setAddresses,
] = useState<Address[]>([]);

const [
isLoading,
setIsLoading,
] = useState(true);

const [
error,
setError,
] = useState<string | null>(null);

const {
isAuthenticated,
isLoading: isAuthLoading,
} = useAuthContext();

const fetchAddresses =
useCallback(async () => {
try {
setIsLoading(true);
setError(null);

    const data =
      await getAddresses();

    setAddresses(data);
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "خطا در دریافت آدرس‌ها.",
    );
  } finally {
    setIsLoading(false);
  }
}, []);

useEffect(() => {
if (isAuthLoading) {
return;
}

if (!isAuthenticated) {
  setAddresses([]);
  setIsLoading(false);
  return;
}

void fetchAddresses();

}, [
isAuthenticated,
isAuthLoading,
fetchAddresses,
]);

const addAddress =
useCallback(
async (
data: CreateAddressInput,
) => {
try {
setError(null);

      const newAddress =
        await createAddress(data);

      setAddresses(
        (current) => {
          if (
            newAddress.isDefault
          ) {
            return [
              newAddress,
              ...current.map(
                (address) => ({
                  ...address,
                  isDefault: false,
                }),
              ),
            ];
          }

          return [
            newAddress,
            ...current,
          ];
        },
      );

      return newAddress;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "خطا در ایجاد آدرس.";

      setError(message);

      throw error;
    }
  },
  [],
);

const editAddress =
useCallback(
async (
addressId: string,
data: UpdateAddressInput,
) => {
try {
setError(null);

      const updatedAddress =
        await updateAddress(
          addressId,
          data,
        );

      setAddresses(
        (current) =>
          current.map(
            (address) =>
              address.id === addressId
                ? updatedAddress
                : address,
          ),
      );

      return updatedAddress;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "خطا در بروزرسانی آدرس.";

      setError(message);

      throw error;
    }
  },
  [],
);

const removeAddress =
useCallback(
async (
addressId: string,
) => {
try {
setError(null);

      await deleteAddress(
        addressId,
      );

      setAddresses(
        (current) =>
          current.filter(
            (address) =>
              address.id !==
              addressId,
          ),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "خطا در حذف آدرس.";

      setError(message);

      throw error;
    }
  },
  [],
);

const makeDefault =
useCallback(
async (
addressId: string,
) => {
try {
setError(null);

      const updatedAddress =
        await setDefaultAddress(
          addressId,
        );

      setAddresses(
        (current) =>
          current.map(
            (address) => ({
              ...address,
              isDefault:
                address.id ===
                addressId,
            }),
          ),
      );

      return updatedAddress;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "خطا در تغییر آدرس پیش‌فرض.";

      setError(message);

      throw error;
    }
  },
  [],
);

return (
<AddressContext.Provider
value={{
addresses,
isLoading,
error,
fetchAddresses,
addAddress,
editAddress,
removeAddress,
makeDefault,
}}
>
{children}
</AddressContext.Provider>
);
}

export function useAddressContext() {
const context =
useContext(AddressContext);

if (!context) {
throw new Error(
"useAddressContext باید داخل AddressProvider استفاده شود.",
);
}

return context;
}
