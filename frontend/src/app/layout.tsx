import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {AddressProvider,} from "@/features/addresses/address.context";
import {ProfileProvider,} from "@/features/profile/profile.context";
import "./globals.css";

import {
  AuthProvider,
} from "@/features/auth/auth.context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "کافه ماچا",
  description:
    "کافه و فروشگاه تخصصی ماچا",
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
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
<AuthProvider>
  <AddressProvider>
    <ProfileProvider>
      {children}
    </ProfileProvider>
  </AddressProvider>
</AuthProvider>
      </body>
    </html>
  );
}