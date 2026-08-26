"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  ShoppingBag,
  Menu,
  X,
  Leaf,
  User,
  Search,
  ChevronDown,
} from "lucide-react";

import Container from "./Container";
import { useCart } from "@/features/cart/cart.context";

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
    label: "درباره ما",
    href: "/about",
  },
  {
    label: "تماس با ما",
    href: "/contact",
  },
];

const shopCategories = [
  {
    title: "ماچا",
    items: [
      { label: "همه محصولات ماچا", href: "/shop?category=matcha" },
      { label: "ماچا تشریفاتی", href: "/shop?category=ceremonial-matcha" },
      { label: "ماچا لاته", href: "/shop?category=matcha-latte" },
    ],
  },
  {
    title: "قهوه",
    items: [
      { label: "همه محصولات قهوه", href: "/shop?category=coffee" },
      { label: "قهوه دانه", href: "/shop?category=coffee-beans" },
      { label: "قهوه آسیاب شده", href: "/shop?category=ground-coffee" },
    ],
  },
  {
    title: "چای و دمنوش",
    items: [
      { label: "چای سبز", href: "/shop?category=green-tea" },
      { label: "چای سیاه", href: "/shop?category=black-tea" },
      { label: "دمنوش", href: "/shop?category=herbal-tea" },
    ],
  },
  {
    title: "ابزار دم‌آوری",
    items: [
      { label: "ابزار ماچا", href: "/shop?category=matcha-tools" },
      { label: "ابزار قهوه", href: "/shop?category=coffee-tools" },
      { label: "لوازم جانبی", href: "/shop?category=accessories" },
    ],
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const pathname = usePathname();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`
        fixed
        left-5
        right-5
        top-4
        z-[999]
        rounded-[2.5rem]
        border
        transition-all
        duration-500
        ${
          scrolled
            ? "border-[#355e3b]/10 bg-white/90 shadow-xl backdrop-blur-xl"
            : "border-white/20 bg-black/20 backdrop-blur-md"
        }
      `}
    >
      <Container>
        <nav className="flex h-[76px] items-center justify-between">

          {/* Logo */}

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-[#355e3b]
                text-white
                shadow-lg
                transition
                duration-300
                hover:rotate-12
              "
            >
              <Leaf size={24} />
            </div>

            <div>
              <h1
                className={`
                  font-serif
                  text-xl
                  font-bold
                  transition-colors
                  ${
                    scrolled
                      ? "text-[#203c27]"
                      : "text-white"
                  }
                `}
              >
                کافه ماچا
              </h1>

              <p
                className={`
                  text-xs
                  transition-colors
                  ${
                    scrolled
                      ? "text-[#355e3b]"
                      : "text-white/80"
                  }
                `}
              >
                Matcha & Coffee Experience
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <div className="hidden items-center gap-7 md:flex">

            {/* Home */}

            <Link
              href="/"
              className={`
                relative
                text-sm
                font-semibold
                transition-colors
                ${
                  pathname === "/"
                    ? "text-[#d97706]"
                    : scrolled
                      ? "text-[#355e3b]"
                      : "text-white"
                }
                hover:text-[#d97706]
              `}
            >
              خانه

              {pathname === "/" && (
                <span
                  className="
                    absolute
                    -bottom-2
                    right-0
                    h-0.5
                    w-5
                    rounded-full
                    bg-[#d97706]
                  "
                />
              )}
            </Link>

            {/* Shop + Mega Menu */}

            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <Link
                href="/shop"
                className={`
                  relative
                  flex
                  items-center
                  gap-1
                  text-sm
                  font-semibold
                  transition-colors
                  ${
                    pathname.startsWith("/shop")
                      ? "text-[#d97706]"
                      : scrolled
                        ? "text-[#355e3b]"
                        : "text-white"
                  }
                  hover:text-[#d97706]
                `}
              >
                فروشگاه

                <ChevronDown
                  size={15}
                  className={`
                    transition-transform
                    duration-300
                    ${shopOpen ? "rotate-180" : ""}
                  `}
                />

                {pathname.startsWith("/shop") && (
                  <span
                    className="
                      absolute
                      -bottom-2
                      right-0
                      h-0.5
                      w-5
                      rounded-full
                      bg-[#d97706]
                    "
                  />
                )}
              </Link>

              {/* Mega Menu */}

              {shopOpen && (
                <div
                  className="
                    absolute
                    right-1/2
                    top-full
                    w-[760px]
                    translate-x-1/2
                    pt-4
                  "
                >
                  <div
                    className="
                      overflow-hidden
                      rounded-[2rem]
                      border
                      border-[#355e3b]/10
                      bg-white
                      p-7
                      shadow-2xl
                    "
                  >
                    <div className="grid grid-cols-4 gap-6">

                      {shopCategories.map((category) => (
                        <div key={category.title}>
                          <h3
                            className="
                              mb-4
                              text-sm
                              font-bold
                              text-[#203c27]
                            "
                          >
                            {category.title}
                          </h3>

                          <div className="space-y-2">
                            {category.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="
                                  block
                                  rounded-xl
                                  px-2
                                  py-1.5
                                  text-xs
                                  text-slate-500
                                  transition
                                  hover:bg-[#f8f5ed]
                                  hover:text-[#d97706]
                                "
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}

                    </div>

                    <div
                      className="
                        mt-6
                        border-t
                        border-[#355e3b]/10
                        pt-5
                      "
                    >
                      <Link
                        href="/shop"
                        className="
                          inline-flex
                          items-center
                          gap-2
                          text-sm
                          font-bold
                          text-[#355e3b]
                          transition
                          hover:text-[#d97706]
                        "
                      >
                        مشاهده همه محصولات
                        <span>←</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other Links */}

            {navLinks.slice(1).map((item) => {
              const isActive =
                pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative
                    text-sm
                    font-semibold
                    transition-colors
                    ${
                      isActive
                        ? "text-[#d97706]"
                        : scrolled
                          ? "text-[#355e3b]"
                          : "text-white"
                    }
                    hover:text-[#d97706]
                  `}
                >
                  {item.label}

                  {isActive && (
                    <span
                      className="
                        absolute
                        -bottom-2
                        right-0
                        h-0.5
                        w-5
                        rounded-full
                        bg-[#d97706]
                      "
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}

          <div className="flex items-center gap-3">

            {/* Search */}

            <button
              type="button"
              onClick={() =>
                setSearchOpen((value) => !value)
              }
              aria-label="جستجو"
              className="
                hidden
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-[#d97706]
                text-white
                shadow-lg
                transition
                hover:scale-110
                md:flex
              "
            >
              {searchOpen ? (
                <X size={18} />
              ) : (
                <Search size={18} />
              )}
            </button>

            {/* Account */}

            <Link
              href="/login"
              aria-label="ورود"
              className="
                hidden
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-[#d97706]
                text-white
                shadow-lg
                transition
                hover:scale-110
                md:flex
              "
            >
              <User size={18} />
            </Link>

            {/* Cart */}

            <Link
              href="/cart"
              aria-label="سبد خرید"
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-[#d97706]
                text-white
                shadow-lg
                transition
                hover:scale-110
              "
            >
              <ShoppingBag size={20} />

              {itemCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-[#203c27]
                    px-1
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  {itemCount.toLocaleString("fa-IR")}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}

            <button
              type="button"
              onClick={() =>
                setOpen((value) => !value)
              }
              aria-label={
                open
                  ? "بستن منو"
                  : "باز کردن منو"
              }
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-white
                text-[#355e3b]
                shadow-sm
                md:hidden
              "
            >
              {open ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </nav>

        {/* Search Panel */}

        {searchOpen && (
          <div
            className="
              border-t
              border-[#355e3b]/10
              px-2
              py-4
            "
          >
            <div className="relative">
              <Search
                size={18}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-[#355e3b]
                "
              />

              <input
                autoFocus
                type="search"
                placeholder="جستجوی محصول، ماچا، قهوه و..."
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border
                  border-[#355e3b]/10
                  bg-white/80
                  pr-12
                  pl-4
                  text-sm
                  text-[#203c27]
                  outline-none
                  placeholder:text-slate-400
                  focus:border-[#d97706]
                "
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}

        {open && (
          <div
            className="
              mb-4
              rounded-3xl
              bg-white
              p-4
              shadow-xl
              md:hidden
            "
          >
            {navLinks.map((item) => {
              const isActive =
                pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`
                    block
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    transition
                    ${
                      isActive
                        ? "bg-[#f8f5ed] text-[#d97706]"
                        : "text-[#355e3b] hover:bg-[#f8f5ed]"
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Search */}

            <button
              type="button"
              onClick={() =>
                setSearchOpen((value) => !value)
              }
              className="
                mt-1
                flex
                w-full
                items-center
                gap-3
                rounded-2xl
                px-4
                py-3
                text-sm
                font-semibold
                text-[#355e3b]
                transition
                hover:bg-[#f8f5ed]
              "
            >
              <Search size={18} />
              جستجو
            </button>
          </div>
        )}
      </Container>
    </header>
  );
}
