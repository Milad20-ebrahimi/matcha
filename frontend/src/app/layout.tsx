import type { ReactNode } from "react";
import "./globals.css";

import { AuthProvider } from "@/features/auth/auth.context";
import { CartProvider } from "@/features/cart/cart.context";
import { ProductsProvider } from "@/features/products/context/ProductsContext";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <AuthProvider>
          <CartProvider>
            <ProductsProvider>
              {children}
            </ProductsProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
