"use client";

import type { ReactNode } from "react";

import { ProfileProvider } from "@/features/profile/profile.context";
import { AddressProvider } from "@/features/addresses/address.context";

type AccountLayoutProps = {
  children: ReactNode;
};

export default function AccountLayout({
  children,
}: AccountLayoutProps) {
  return (
    <ProfileProvider>
      <AddressProvider>
        {children}
      </AddressProvider>
    </ProfileProvider>
  );
}