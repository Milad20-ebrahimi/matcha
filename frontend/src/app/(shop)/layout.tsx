import type { ReactNode } from "react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

type ShopLayoutProps = {
  children: ReactNode;
};

export default function ShopLayout({
  children,
}: ShopLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}