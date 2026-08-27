"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useAuthContext } from "@/features/auth/auth.context";

import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
} from "./cart.api";

import {
  getGuestCart,
  saveGuestCart,
  clearGuestCart,
} from "./cart.storage";

import type {
  Cart,
  CartItem,
} from "./types";

type CartContextValue = {
  cart: Cart;
  itemCount: number;
  isLoading: boolean;
  error: string | null;

  addToCart: (
    productId: string,
    quantity?: number,
  ) => Promise<void>;

  removeFromCart: (
    productId: string,
  ) => Promise<void>;

  updateQuantity: (
    productId: string,
    quantity: number,
  ) => Promise<void>;

  clearCart: () => Promise<void>;

  refreshCart: () => Promise<void>;
};

const CartContext =
  createContext<
    CartContextValue | undefined
  >(undefined);

const emptyCart: Cart = {
  id: "",
  userId: "",
  items: [],
};

function guestItemsToCart(
  items: CartItem[],
): Cart {
  return {
    ...emptyCart,
    items,
  };
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    isAuthenticated,
    isLoading: authLoading,
  } = useAuthContext();

  const [cart, setCart] =
    useState<Cart>(emptyCart);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * جلوگیری از Merge شدن چندباره
   * Guest Cart هنگام Login
   */
  const hasMergedGuestCart =
    useRef(false);

  /*
   * انتقال Guest Cart به Cart کاربر
   */
  const mergeGuestCart =
    useCallback(async () => {
      const guestCart =
        getGuestCart();

      if (
        !guestCart.items.length
      ) {
        return;
      }

      for (
        const item of guestCart.items
      ) {
        await addCartItem(
          item.productId,
          item.quantity,
        );
      }

      /*
       * فقط زمانی Guest Cart را پاک می‌کنیم
       * که تمام محصولات با موفقیت منتقل شده باشند.
       */
      clearGuestCart();
    }, []);

  /*
   * دریافت سبد خرید
   */
  const loadCart =
    useCallback(async () => {
      if (authLoading) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        /*
         * کاربر وارد شده
         */
        if (isAuthenticated) {
          /*
           * ابتدا Guest Cart را منتقل می‌کنیم.
           */
          if (
            !hasMergedGuestCart.current
          ) {
            await mergeGuestCart();

            hasMergedGuestCart.current =
              true;
          }

          /*
           * سپس Cart واقعی کاربر را
           * از Backend دریافت می‌کنیم.
           */
          const response =
            await getCart();

          setCart(
            response.data,
          );
        } else {
          /*
           * کاربر مهمان
           */
          const guestCart =
            getGuestCart();

          setCart(
            guestItemsToCart(
              guestCart.items,
            ),
          );

          /*
           * در Logout اجازه می‌دهیم
           * در Login بعدی دوباره Merge انجام شود.
           */
          hasMergedGuestCart.current =
            false;
        }
      } catch (error) {
        console.error(
          "Failed to load cart:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "خطا در دریافت سبد خرید.",
        );

        /*
         * اگر کاربر Login است،
         * Cart خالی نمایش داده می‌شود.
         */
        if (isAuthenticated) {
          setCart(emptyCart);
        } else {
          /*
           * اگر Guest است،
           * اطلاعات localStorage حفظ می‌شود.
           */
          setCart(
            guestItemsToCart(
              getGuestCart().items,
            ),
          );
        }
      } finally {
        setIsLoading(false);
      }
    }, [
      isAuthenticated,
      authLoading,
      mergeGuestCart,
    ]);

  /*
   * هر زمان وضعیت Auth تغییر کرد،
   * Cart را دوباره Load می‌کنیم.
   */
  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  /*
   * ذخیره Guest Cart در localStorage
   */
  useEffect(() => {
    /*
     * Cart کاربر Login شده
     * نباید در localStorage ذخیره شود.
     */
    if (
      isAuthenticated ||
      cart.id
    ) {
      return;
    }

    saveGuestCart({
      items: cart.items,
    });
  }, [
    cart,
    isAuthenticated,
  ]);

  /*
   * افزودن محصول به سبد خرید
   */
  const addToCart =
    useCallback(
      async (
        productId: string,
        quantity = 1,
      ) => {
        if (
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          return;
        }

        setError(null);

        /*
         * کاربر Login شده
         */
        if (isAuthenticated) {
          try {
            await addCartItem(
              productId,
              quantity,
            );

            await loadCart();
          } catch (error) {
            console.error(
              "Add cart item error:",
              error,
            );

            setError(
              error instanceof Error
                ? error.message
                : "خطا در افزودن محصول به سبد خرید.",
            );

            throw error;
          }

          return;
        }

        /*
         * Guest Cart
         */
        setCart(
          (currentCart) => {
            const existingItem =
              currentCart.items.find(
                (item) =>
                  item.productId ===
                  productId,
              );

            /*
             * اگر محصول قبلاً وجود دارد،
             * تعداد آن را افزایش می‌دهیم.
             */
            if (existingItem) {
              return {
                ...currentCart,

                items:
                  currentCart.items.map(
                    (item) =>
                      item.productId ===
                      productId
                        ? {
                            ...item,
                            quantity:
                              item.quantity +
                              quantity,
                          }
                        : item,
                  ),
              };
            }

            /*
             * محصول جدید
             */
            return {
              ...currentCart,

              items: [
                ...currentCart.items,
                {
                  id: `guest-${productId}`,

                  productId,

                  quantity,

                  /*
                   * اطلاعات محصول واقعی
                   * بعداً در صفحه Cart دریافت می‌شود.
                   */
                  product: {
                    id: productId,
                    name: "",
                    slug: "",
                    price: 0,
                    stock: 0,
                    image: null,
                    isActive: true,
                  },
                },
              ],
            };
          },
        );
      },
      [
        isAuthenticated,
        loadCart,
      ],
    );

  /*
   * حذف محصول از سبد خرید
   */
  const removeFromCart =
    useCallback(
      async (
        productId: string,
      ) => {
        setError(null);

        /*
         * Cart کاربر Login شده
         */
        if (isAuthenticated) {
          try {
            await removeCartItem(
              productId,
            );

            await loadCart();
          } catch (error) {
            console.error(
              "Remove cart item error:",
              error,
            );

            setError(
              error instanceof Error
                ? error.message
                : "خطا در حذف محصول.",
            );

            throw error;
          }

          return;
        }

        /*
         * Guest Cart
         */
        setCart(
          (currentCart) => ({
            ...currentCart,

            items:
              currentCart.items.filter(
                (item) =>
                  item.productId !==
                  productId,
              ),
          }),
        );
      },
      [
        isAuthenticated,
        loadCart,
      ],
    );

  /*
   * تغییر تعداد محصول
   */
  const updateQuantity =
    useCallback(
      async (
        productId: string,
        quantity: number,
      ) => {
        /*
         * اگر تعداد به صفر برسد،
         * محصول حذف می‌شود.
         */
        if (quantity <= 0) {
          await removeFromCart(
            productId,
          );

          return;
        }

        if (
          !Number.isInteger(quantity)
        ) {
          return;
        }

        setError(null);

        /*
         * Cart کاربر Login شده
         */
        if (isAuthenticated) {
          try {
            await updateCartItem(
              productId,
              quantity,
            );

            await loadCart();
          } catch (error) {
            console.error(
              "Update cart item error:",
              error,
            );

            setError(
              error instanceof Error
                ? error.message
                : "خطا در بروزرسانی تعداد محصول.",
            );

            throw error;
          }

          return;
        }

        /*
         * Guest Cart
         */
        setCart(
          (currentCart) => ({
            ...currentCart,

            items:
              currentCart.items.map(
                (item) =>
                  item.productId ===
                  productId
                    ? {
                        ...item,
                        quantity,
                      }
                    : item,
              ),
          }),
        );
      },
      [
        isAuthenticated,
        loadCart,
        removeFromCart,
      ],
    );

  /*
   * خالی کردن کامل سبد خرید
   */
  const clearCart =
    useCallback(async () => {
      setError(null);

      /*
       * Cart کاربر Login شده
       */
      if (isAuthenticated) {
        try {
          await clearCartApi();

          await loadCart();
        } catch (error) {
          console.error(
            "Clear cart error:",
            error,
          );

          setError(
            error instanceof Error
              ? error.message
              : "خطا در خالی کردن سبد خرید.",
          );

          throw error;
        }

        return;
      }

      /*
       * Guest Cart
       */
      clearGuestCart();

      setCart(emptyCart);
    }, [
      isAuthenticated,
      loadCart,
    ]);

  /*
   * تعداد کل محصولات
   */
  const itemCount =
    useMemo(
      () =>
        cart.items.reduce(
          (
            total,
            item,
          ) =>
            total +
            item.quantity,
          0,
        ),
      [cart.items],
    );

  /*
   * مقدار Context
   */
  const value =
    useMemo(
      () => ({
        cart,
        itemCount,
        isLoading,
        error,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        refreshCart:
          loadCart,
      }),
      [
        cart,
        itemCount,
        isLoading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadCart,
      ],
    );

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

/*
 * Hook استفاده از Cart
 */
export function useCart() {
  const context =
    useContext(
      CartContext,
    );

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider.",
    );
  }

  return context;
}