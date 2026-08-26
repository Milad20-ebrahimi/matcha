import {
  useCart as useCartContext,
} from "@/features/cart/cart.context";

export function useCart() {
  return useCartContext();
}

export default useCart;
