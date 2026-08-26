"use client";

import Link from "next/link";

import Container from "./Container";
import Button from "../ui/button";

import {
  useCart,
} from "@/features/cart/cart.context";

const navLinks = [
  {
    label: "خانه",
    href: "/",
  },
  {
    label: "منوی کافه",
    href: "/cafe",
  },
  {
    label: "فروشگاه",
    href: "/shop",
  },
  {
    label: "درباره ما",
    href: "/about",
  },
  {
    label: "تماس با ما",
    href: "/contact",
  },
];

export default function Navbar() {
  const {
    itemCount,
  } = useCart();

  return (
    <header className="border-b border-slate-100 bg-white">
      <Container>
        <nav className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-wide text-slate-900"
          >
            MATCHA CAFE
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="
                  text-sm
                  text-slate-600
                  transition
                  hover:text-slate-900
                "
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">

            {/* Login */}
            <Link href="/login">
              <Button
                variant="outline"
                className="hidden md:inline-flex"
              >
                ورود
              </Button>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="
                relative
                rounded-full
                bg-slate-900
                px-5
                py-3
                text-sm
                text-white
                transition
                hover:bg-slate-800
              "
            >
              سبد خرید

              {itemCount > 0 && (
                <span
                  className="
                    absolute
                    -right-2
                    -top-2
                    flex
                    h-6
                    min-w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-green-700
                    px-1.5
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  {itemCount.toLocaleString("fa-IR")}
                </span>
              )}
            </Link>

          </div>
        </nav>
      </Container>
    </header>
  );
}
