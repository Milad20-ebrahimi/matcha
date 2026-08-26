import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

import "./globals.css";

import { AuthProvider } from "@/features/auth/auth.context";
import { CartProvider } from "@/features/cart/cart.context";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: {
    default:
      "MATCHA CAFE | تجربه اصیل ماچا و قهوه",
    template:
      "%s | MATCHA CAFE",
  },

  description:
    "کافه و فروشگاه تخصصی ماچا، چای، قهوه و ابزارهای دم‌آوری پریمیوم",

  keywords: [
    "Matcha",
    "Coffee",
    "Tea",
    "Cafe",
    "ماچا",
    "قهوه",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} antialiased`}
    >
     <body className="min-h-screen bg-white text-slate-900">
  <AuthProvider>
    <CartProvider>
      {children}
    </CartProvider>
  </AuthProvider>
</body>
    </html>
  );
}