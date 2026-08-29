import type { ReactNode } from "react";
import "./globals.css";

import { AuthProvider } from "@/features/auth/auth.context";
import { CartProvider } from "@/features/cart/cart.context";
import { ProductsProvider } from "@/features/products/context/ProductsContext";
import { AddressProvider } from "@/features/addresses/address.context";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
<body>
  <AuthProvider>
    <AddressProvider>
      <CartProvider>
        <ProductsProvider>
          {children}
        </ProductsProvider>
      </CartProvider>
    </AddressProvider>
  </AuthProvider>
</body>
    </html>
  );
}
