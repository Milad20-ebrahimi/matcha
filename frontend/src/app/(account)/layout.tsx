"use client";

import type { ReactNode } from "react";

import { ProfileProvider } from "@/features/profile/profile.context";

type AccountLayoutProps = {
  children: ReactNode;
};

export default function AccountLayout({
  children,
}: AccountLayoutProps) {
  return (
    <ProfileProvider>
      {children}
    </ProfileProvider>
  );
}