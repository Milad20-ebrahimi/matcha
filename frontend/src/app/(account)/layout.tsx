"use client";

import type { ReactNode } from "react";

import { ProfileProvider } from "@/features/profile/profile.context";
import { AddressProvider } from "@/features/addresses/address.context";

export default function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProfileProvider>
      <AddressProvider>
        {children}
      </AddressProvider>
    </ProfileProvider>
  );
}
