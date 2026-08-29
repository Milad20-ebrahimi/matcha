
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  MapPin,
  ShoppingBag,
  Heart,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  LogOut,
} from "lucide-react";

import { useAuthContext } from "@/features/auth/auth.context";

const menuItems = [
  {
    href: "/account",
    label: "نمای کلی حساب",
    icon: User,
    exact: true,
  },
  {
    href: "/account/profile",
    label: "پروفایل من",
    icon: User,
  },
  {
    href: "/account/orders",
    label: "سفارش‌های من",
    icon: ShoppingBag,
  },
  {
    href: "/account/addresses",
    label: "آدرس‌های من",
    icon: MapPin,
  },
  {
    href: "/account/wishlist",
    label: "علاقه‌مندی‌ها",
    icon: Heart,
  },
  {
    href: "/account/reviews",
    label: "نظرات من",
    icon: MessageSquare,
  },
  {
    href: "/account/photos",
    label: "تصاویر من",
    icon: ImageIcon,
  },
  {
    href: "/account/messages",
    label: "پیام‌های سایت",
    icon: MessageSquare,
  },
  {
    href: "/account/settings",
    label: "تنظیمات",
    icon: Settings,
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  function isActive(href: string, exact?: boolean) {
    if (exact) {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  async function handleLogout() {
    await logout();
    window.location.href = "/login";
  }

  const fullName =
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ") || "کاربر";

  const initial =
    user?.firstName?.charAt(0) || "؟";

  return (
    <aside className="w-full lg:w-[280px] lg:shrink-0">
      <div className="overflow-hidden rounded-[32px] border border-[#b9d19a]/30 bg-white/80 shadow-[0_30px_80px_-40px_rgba(13,26,18,0.30)] backdrop-blur-xl">
        <div className="border-b border-[#0d1a12]/10 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#203c27] text-xl font-semibold text-[#f8f5ed]">
              {initial}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-[#203c27]">
                {fullName}
              </p>

              <p className="mt-1 truncate text-xs text-[#203c27]/50">
                {user?.phone || user?.email || ""}
              </p>
            </div>
          </div>
        </div>

        <nav className="p-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(
                item.href,
                item.exact
              );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-300",
                    active
                      ? "bg-[#203c27] text-white shadow-lg"
                      : "text-[#203c27]/70 hover:bg-[#f8f5ed] hover:text-[#203c27]",
                  ].join(" ")}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[#0d1a12]/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={19} />
            <span>خروج از حساب</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
