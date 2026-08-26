import type {
  CartItem,
} from "./types";

const CART_STORAGE_KEY =
  "matcha-guest-cart";

export type GuestCart = {
  items: CartItem[];
};

const emptyGuestCart: GuestCart = {
  items: [],
};

export function getGuestCart(): GuestCart {
  if (
    typeof window === "undefined"
  ) {
    return emptyGuestCart;
  }

  try {
    const stored =
      localStorage.getItem(
        CART_STORAGE_KEY,
      );

    if (!stored) {
      return emptyGuestCart;
    }

    const parsed: unknown =
      JSON.parse(stored);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("items" in parsed) ||
      !Array.isArray(
        (parsed as {
          items: unknown;
        }).items,
      )
    ) {
      return emptyGuestCart;
    }

    const items =
      (
        parsed as {
          items: unknown[];
        }
      ).items.filter(
        (
          item: unknown,
        ): item is CartItem => {
          if (
            !item ||
            typeof item !== "object"
          ) {
            return false;
          }

          const value =
            item as Record<
              string,
              unknown
            >;

          return (
            typeof value.productId ===
              "string" &&
            typeof value.quantity ===
              "number" &&
            Number.isInteger(
              value.quantity,
            ) &&
            value.quantity > 0
          );
        },
      );

    return {
      items,
    };
  } catch {
    return emptyGuestCart;
  }
}

export function saveGuestCart(
  cart: GuestCart,
): void {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(cart),
  );
}

export function clearGuestCart(): void {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  localStorage.removeItem(
    CART_STORAGE_KEY,
  );
}