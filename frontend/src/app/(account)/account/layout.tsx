
import type { ReactNode } from "react";

import Container from "@/components/shared/Container";
import AccountSidebar from "@/components/account/AccountSidebar";

export default function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f8f5ed] py-28">
      <Container>
        <div className="mb-10">
          <p className="text-xs tracking-[0.35em] text-[#355e3b]">
            MY ACCOUNT
          </p>

          <h1 className="mt-4 text-4xl font-light text-[#203c27] sm:text-5xl">
            حساب کاربری
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-8 text-[#203c27]/60">
            مدیریت اطلاعات شخصی، سفارش‌ها، آدرس‌ها و علاقه‌مندی‌های شما.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <AccountSidebar />

          <section className="min-w-0 flex-1">
            {children}
          </section>
        </div>
      </Container>
    </main>
  );
}
