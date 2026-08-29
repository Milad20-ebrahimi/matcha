"use client";

import { useState } from "react";

import Button from "@/components/ui/button";
import { useCart } from "@/features/cart/hooks/useCart";
import type { Product } from "@/features/products/types";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
}

export default function AddToCartButton({
  product,
  quantity = 1,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleClick() {
    if (adding) {
      return;
    }

    try {
      setAdding(true);

      await addToCart(
        product.id,
        quantity,
      );

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1500);
    } catch (error) {
      console.error(
        "Failed adding product to cart:",
        error,
      );
    } finally {
      setAdding(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={adding}
      className="
        w-full
        py-4
        text-base
        font-semibold
      "
    >
      {adding
        ? "Ø¯Ø± Ø­Ø§Ù„ Ø§ÙØ²ÙˆØ¯Ù†..."
        : added
          ? "âœ“ Ø§Ø¶Ø§ÙÙ‡ Ø´Ø¯"
          : "Ø§ÙØ²ÙˆØ¯Ù† Ø¨Ù‡ Ø³Ø¨Ø¯ Ø®Ø±ÛŒØ¯"}
    </Button>
  );
}

