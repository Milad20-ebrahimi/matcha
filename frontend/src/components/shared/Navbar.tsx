
"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ChevronDown,
  Leaf,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import type { Product } from "@/features/products/types";
import {
  fetchProducts,
} from "@/features/products/services/product.service";

import Container from "./Container";
import { useCart } from "@/features/cart/cart.context";

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

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
    label: "وبلاگ",
    href: "/about",
  },
  {
    label: "درباره ما",
    href: "/about",
  },
  {
    label: "رزرو میز",
    href: "/contact",
  },
];

/* -------------------------------------------------------------------------- */
/* Category Helpers                                                           */
/* -------------------------------------------------------------------------- */

function normalizeText(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ى/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ة/g, "ه")
    .replace(/ۀ/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/إ/g, "ا")
    .replace(/أ/g, "ا")
    .replace(/آ/g, "ا")
    .replace(/‌/g, " ")
    .replace(/\s+/g, " ");
}

/*
 * عنوان نمایشی بعضی دسته‌بندی‌ها
 *
 * اگر دسته جدیدی در دیتابیس اضافه شود و اینجا نباشد،
 * خود name دیتابیس نمایش داده می‌شود.
 */
function getCategoryLabel(
  name: string,
  slug: string
) {
  const normalizedSlug =
    normalizeText(slug);

  const labels: Record<string, string> = {
    matcha: "ماچا",
    coffee: "قهوه",
    tea: "چای",
    accessories: "ابزار دم‌آوری",
    sets: "پک و ست",
  };

  return (
    labels[normalizedSlug] ??
    name
  );
}

/*
 * ترتیب پیشنهادی دسته‌بندی‌ها
 */
const categoryOrder = [
  "matcha",
  "coffee",
  "tea",
  "accessories",
  "sets",
];

/* -------------------------------------------------------------------------- */
/* Search Helpers                                                             */
/* -------------------------------------------------------------------------- */

function createSearchTokens(
  value: string
) {
  return normalizeText(value)
    .split(" ")
    .filter(Boolean);
}

function matchesSearch(
  product: Product,
  query: string
) {
  const normalizedQuery =
    normalizeText(query);

  if (!normalizedQuery) {
    return false;
  }

  const searchableText =
    normalizeText(
      [
        product.name,
        product.description,
        product.slug,
        product.category?.name,
        product.category?.slug,
        product.brand?.name,
        product.brand?.slug,
      ]
        .filter(Boolean)
        .join(" ")
    );

  if (
    searchableText.includes(
      normalizedQuery
    )
  ) {
    return true;
  }

  const tokens =
    createSearchTokens(
      normalizedQuery
    );

  return tokens.every((token) =>
    searchableText.includes(token)
  );
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { itemCount } = useCart();

  const [open, setOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const [shopOpen, setShopOpen] =
    useState(false);

  const [mobileShopOpen, setMobileShopOpen] =
    useState(false);

  const [mobileCategoryOpen, setMobileCategoryOpen] =
    useState<string | null>(null);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [products, setProducts] =
    useState<Product[]>([]);

  const [productsLoading, setProductsLoading] =
    useState(true);

  const searchInputRef =
    useRef<HTMLInputElement | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Load Products                                                            */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    fetchProducts()
      .then((data) => {
        if (!mounted) {
          return;
        }

        setProducts(data);
      })
      .catch((error) => {
        console.error(
          "Failed loading products for navbar:",
          error
        );
      })
      .finally(() => {
        if (!mounted) {
          return;
        }

        setProductsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Build Categories From Real Products                                     */
  /* ------------------------------------------------------------------------ */

  const shopCategories =
    useMemo(() => {
      const categoryMap =
        new Map<
          string,
          {
            title: string;
            slug: string;
          }
        >();

      products.forEach((product) => {
        const category =
          product.category;

        if (!category) {
          return;
        }

        const slug =
          normalizeText(category.slug);

        if (!slug) {
          return;
        }

        if (
          categoryMap.has(slug)
        ) {
          return;
        }

        categoryMap.set(slug, {
          title: getCategoryLabel(
            category.name,
            category.slug
          ),
          slug: category.slug,
        });
      });

      return Array.from(
        categoryMap.values()
      ).sort((a, b) => {
        const aIndex =
          categoryOrder.indexOf(
            normalizeText(a.slug)
          );

        const bIndex =
          categoryOrder.indexOf(
            normalizeText(b.slug)
          );

        if (
          aIndex !== -1 &&
          bIndex !== -1
        ) {
          return aIndex - bIndex;
        }

        if (aIndex !== -1) {
          return -1;
        }

        if (bIndex !== -1) {
          return 1;
        }

        return a.title.localeCompare(
          b.title,
          "fa"
        );
      });
    }, [products]);

  /* ------------------------------------------------------------------------ */
  /* Scroll                                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 50
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Focus Search                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchOpen]);

  /* ------------------------------------------------------------------------ */
  /* Close Search On Route Change                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  /* ------------------------------------------------------------------------ */
  /* Escape                                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key !== "Escape") {
        return;
      }

      setSearchOpen(false);
      setSearchQuery("");
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Mobile Menu                                                              */
  /* ------------------------------------------------------------------------ */

  const closeMobileMenu = () => {
    setOpen(false);
    setMobileShopOpen(false);
    setMobileCategoryOpen(null);
  };

  const toggleMobileCategory = (
    title: string
  ) => {
    setMobileCategoryOpen(
      (current) =>
        current === title
          ? null
          : title
    );
  };

  /* ------------------------------------------------------------------------ */
  /* Category Navigation                                                      */
  /* ------------------------------------------------------------------------ */

  const goToCategory = (
    slug: string
  ) => {
    /*
     * مهم:
     * وقتی کاربر از Search وارد صفحه شده،
     * با انتخاب Category باید search قبلی حذف شود.
     */

    setShopOpen(false);
    setMobileShopOpen(false);
    setMobileCategoryOpen(null);
    setOpen(false);

    router.push(
      `/shop?category=${encodeURIComponent(
        slug
      )}`
    );
  };

  /* ------------------------------------------------------------------------ */
  /* Search                                                                   */
  /* ------------------------------------------------------------------------ */

  const normalizedSearchQuery =
    normalizeText(searchQuery);

  const searchResults =
    useMemo(() => {
      if (!normalizedSearchQuery) {
        return [];
      }

      return products
        .filter((product) =>
          matchesSearch(
            product,
            normalizedSearchQuery
          )
        )
        .slice(0, 6);
    }, [
      products,
      normalizedSearchQuery,
    ]);

  const hasSearchQuery =
    normalizedSearchQuery.length > 0;

  const openSearch = () => {
    setSearchOpen(true);

    if (open) {
      closeMobileMenu();
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const submitSearch = () => {
    const query =
      searchQuery.trim();

    if (!query) {
      return;
    }

    closeSearch();

    router.push(
      `/shop?search=${encodeURIComponent(
        query
      )}`
    );
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitSearch();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

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

          {/* ================================================================= */}
          {/* Logo                                                              */}
          {/* ================================================================= */}

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

          {/* ================================================================= */}
          {/* Desktop Navigation                                                */}
          {/* ================================================================= */}

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

            {/* ================================================================= */}
            {/* Desktop Shop                                                      */}
            {/* ================================================================= */}

            <div
              className="relative"
              onMouseEnter={() =>
                setShopOpen(true)
              }
              onMouseLeave={() =>
                setShopOpen(false)
              }
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
                    pathname.startsWith(
                      "/shop"
                    )
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
                    ${
                      shopOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />

                {pathname.startsWith(
                  "/shop"
                ) && (
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

              {/* ============================================================= */}
              {/* Desktop Mega Menu                                               */}
              {/* ============================================================= */}

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

                    {productsLoading ? (
                      <div className="py-8 text-center text-sm text-slate-400">
                        در حال بارگذاری دسته‌بندی‌ها...
                      </div>
                    ) : shopCategories.length === 0 ? (
                      <div className="py-8 text-center text-sm text-slate-400">
                        دسته‌بندی‌ای پیدا نشد.
                      </div>
                    ) : (
                      <div
                        className={`
                          grid
                          gap-6
                          ${
                            shopCategories.length >= 4
                              ? "grid-cols-4"
                              : shopCategories.length === 3
                                ? "grid-cols-3"
                                : shopCategories.length === 2
                                  ? "grid-cols-2"
                                  : "grid-cols-1"
                          }
                        `}
                      >
                        {shopCategories.map(
                          (category) => (
                            <div
                              key={
                                category.slug
                              }
                            >
                              <Link
                                href={`/shop?category=${encodeURIComponent(
                                  category.slug
                                )}`}
                                onClick={() =>
                                  setShopOpen(
                                    false
                                  )
                                }
                                className="
                                  mb-4
                                  block
                                  text-sm
                                  font-bold
                                  text-[#203c27]
                                  transition
                                  hover:text-[#d97706]
                                "
                              >
                                {category.title}
                              </Link>

                              <Link
                                href={`/shop?category=${encodeURIComponent(
                                  category.slug
                                )}`}
                                onClick={() =>
                                  setShopOpen(
                                    false
                                  )
                                }
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
                                همه محصولات{" "}
                                {
                                  category.title
                                }
                              </Link>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* ========================================================= */}
                    {/* All Products                                                */}
                    {/* ========================================================= */}

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
                        onClick={() =>
                          setShopOpen(false)
                        }
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

            {/* ================================================================= */}
            {/* Other Desktop Links                                               */}
            {/* ================================================================= */}

            {navLinks
              .slice(1)
              .map((item) => {
                const isActive =
                  pathname ===
                  item.href;

                return (
                  <Link
                    key={item.label}
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

          {/* ================================================================= */}
          {/* Actions                                                            */}
          {/* ================================================================= */}

          <div className="flex items-center gap-3">

            {/* Desktop Search */}

            <button
              type="button"
              onClick={() => {
                if (searchOpen) {
                  closeSearch();
                } else {
                  openSearch();
                }
              }}
              aria-label={
                searchOpen
                  ? "بستن جستجو"
                  : "جستجو"
              }
              aria-expanded={searchOpen}
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
                  {itemCount.toLocaleString(
                    "fa-IR"
                  )}
                </span>
              )}
            </Link>

            {/* Mobile Account */}

            <Link
              href="/login"
              aria-label="ورود"
              className="
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
                md:hidden
              "
            >
              <User size={18} />
            </Link>

            {/* Mobile Menu */}

            <button
              type="button"
              onClick={() => {
                setOpen(
                  (value) => !value
                );

                if (open) {
                  setMobileShopOpen(
                    false
                  );

                  setMobileCategoryOpen(
                    null
                  );
                }
              }}
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

        {/* =================================================================== */}
        {/* Search Panel                                                        */}
        {/* =================================================================== */}

        {searchOpen && (
          <div
            className="
              border-t
              border-[#355e3b]/10
              px-2
              py-4
            "
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch();
              }}
              className="relative"
            >
              <Search
                size={18}
                className="
                  absolute
                  right-4
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-[#355e3b]
                "
              />

              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleSearchKeyDown
                }
                placeholder="جستجوی محصول، ماچا، قهوه و..."
                autoComplete="off"
                spellCheck={false}
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border
                  border-[#355e3b]/10
                  bg-white/90
                  pr-12
                  pl-12
                  text-sm
                  text-[#203c27]
                  outline-none
                  placeholder:text-slate-400
                  focus:border-[#d97706]
                  focus:ring-2
                  focus:ring-[#d97706]/10
                "
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchQuery("")
                  }
                  aria-label="پاک کردن جستجو"
                  className="
                    absolute
                    left-3
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    text-slate-400
                    transition
                    hover:bg-[#f8f5ed]
                    hover:text-[#355e3b]
                  "
                >
                  <X size={16} />
                </button>
              )}

              {/* Search Results */}

              {hasSearchQuery && (
                <div
                  className="
                    absolute
                    right-0
                    top-[calc(100%+10px)]
                    z-[1000]
                    w-full
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#355e3b]/10
                    bg-white
                    shadow-2xl
                  "
                >
                  {/* Loading */}

                  {productsLoading && (
                    <div
                      className="
                        px-5
                        py-7
                        text-center
                        text-sm
                        text-slate-400
                      "
                    >
                      در حال جستجوی محصولات...
                    </div>
                  )}

                  {/* No Results */}

                  {!productsLoading &&
                    searchResults.length ===
                      0 && (
                      <div
                        className="
                          px-5
                          py-8
                          text-center
                        "
                      >
                        <div
                          className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-[#f8f5ed]
                            text-[#355e3b]
                          "
                        >
                          <Search
                            size={20}
                          />
                        </div>

                        <p
                          className="
                            mt-4
                            text-sm
                            font-semibold
                            text-[#203c27]
                          "
                        >
                          محصولی پیدا نشد
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            leading-6
                            text-slate-400
                          "
                        >
                          برای «
                          {searchQuery}
                          » نتیجه‌ای پیدا نشد.
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-400
                          "
                        >
                          عبارت دیگری را امتحان کنید.
                        </p>
                      </div>
                    )}

                  {/* Results */}

                  {!productsLoading &&
                    searchResults.length >
                      0 && (
                      <div className="py-2">

                        {searchResults.map(
                          (product) => (
                            <Link
                              key={product.id}
                              href={`/shop/${product.slug}`}
                              onClick={() =>
                                closeSearch()
                              }
                              className="
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3
                                text-right
                                transition
                                hover:bg-[#f8f5ed]
                              "
                            >
                              <div
                                className="
                                  h-12
                                  w-12
                                  shrink-0
                                  overflow-hidden
                                  rounded-xl
                                  bg-[#f2e9d8]
                                "
                              >
                                {product.image ? (
                                  <img
                                    src={
                                      product.image
                                    }
                                    alt={
                                      product.name
                                    }
                                    className="
                                      h-full
                                      w-full
                                      object-cover
                                    "
                                  />
                                ) : (
                                  <div
                                    className="
                                      flex
                                      h-full
                                      w-full
                                      items-center
                                      justify-center
                                      text-[10px]
                                      text-[#355e3b]/50
                                    "
                                  >
                                    بدون تصویر
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <h3
                                  className="
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-[#203c27]
                                  "
                                >
                                  {product.name}
                                </h3>

                                {product.category && (
                                  <p
                                    className="
                                      mt-1
                                      truncate
                                      text-[11px]
                                      text-[#b58a47]
                                    "
                                  >
                                    {
                                      product
                                        .category
                                        .name
                                    }
                                  </p>
                                )}
                              </div>

                              <div
                                className="
                                  shrink-0
                                  text-left
                                "
                              >
                                <span
                                  className="
                                    text-xs
                                    font-bold
                                    text-[#355e3b]
                                  "
                                >
                                  {product.price.toLocaleString(
                                    "fa-IR"
                                  )}
                                </span>

                                <span
                                  className="
                                    mr-1
                                    text-[10px]
                                    text-slate-400
                                  "
                                >
                                  تومان
                                </span>
                              </div>
                            </Link>
                          )
                        )}

                        {/* All Results */}

                        <div
                          className="
                            border-t
                            border-[#355e3b]/10
                            px-4
                            py-3
                          "
                        >
                          <button
                            type="submit"
                            className="
                              flex
                              w-full
                              items-center
                              justify-center
                              rounded-xl
                              bg-[#f8f5ed]
                              px-4
                              py-2.5
                              text-xs
                              font-bold
                              text-[#355e3b]
                              transition
                              hover:bg-[#355e3b]
                              hover:text-white
                            "
                          >
                            مشاهده همه نتایج
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </form>
          </div>
        )}

        {/* =================================================================== */}
        {/* Mobile Navigation                                                   */}
        {/* =================================================================== */}

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
            {/* Home */}

            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`
                block
                rounded-2xl
                px-4
                py-3
                text-sm
                font-semibold
                transition
                ${
                  pathname === "/"
                    ? "bg-[#f8f5ed] text-[#d97706]"
                    : "text-[#355e3b] hover:bg-[#f8f5ed]"
                }
              `}
            >
              خانه
            </Link>

            {/* =============================================================== */}
            {/* Mobile Shop                                                      */}
            {/* =============================================================== */}

            <div className="mt-1">
              <div
                className={`
                  flex
                  items-center
                  rounded-2xl
                  transition
                  ${
                    pathname.startsWith(
                      "/shop"
                    )
                      ? "bg-[#f8f5ed]"
                      : "hover:bg-[#f8f5ed]"
                  }
                `}
              >
                <Link
                  href="/shop"
                  onClick={closeMobileMenu}
                  className={`
                    flex-1
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    ${
                      pathname.startsWith(
                        "/shop"
                      )
                        ? "text-[#d97706]"
                        : "text-[#355e3b]"
                    }
                  `}
                >
                  فروشگاه
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setMobileShopOpen(
                      (value) => !value
                    )
                  }
                  aria-expanded={
                    mobileShopOpen
                  }
                  aria-label={
                    mobileShopOpen
                      ? "بستن فروشگاه"
                      : "باز کردن فروشگاه"
                  }
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    text-[#355e3b]
                  "
                >
                  <ChevronDown
                    size={18}
                    className={`
                      transition-transform
                      duration-300
                      ${
                        mobileShopOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>
              </div>

              {/* Categories */}

              <div
                className={`
                  grid
                  transition-all
                  duration-300
                  ${
                    mobileShopOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }
                `}
              >
                <div className="min-h-0 overflow-hidden">
                  <div
                    className="
                      mr-4
                      mt-2
                      border-r
                      border-[#355e3b]/10
                      pr-3
                    "
                  >
                    {productsLoading ? (
                      <div className="px-3 py-4 text-xs text-slate-400">
                        در حال بارگذاری...
                      </div>
                    ) : shopCategories.length ===
                      0 ? (
                      <div className="px-3 py-4 text-xs text-slate-400">
                        دسته‌بندی‌ای پیدا نشد.
                      </div>
                    ) : (
                      shopCategories.map(
                        (category) => {
                          const isOpen =
                            mobileCategoryOpen ===
                            category.title;

                          return (
                            <div
                              key={
                                category.slug
                              }
                              className="mb-1"
                            >
                              <div
                                className="
                                  flex
                                  items-center
                                  rounded-xl
                                  transition
                                  hover:bg-[#f8f5ed]
                                "
                              >
                                <Link
                                  href={`/shop?category=${encodeURIComponent(
                                    category.slug
                                  )}`}
                                  onClick={
                                    closeMobileMenu
                                  }
                                  className="
                                    flex-1
                                    px-3
                                    py-2.5
                                    text-right
                                    text-sm
                                    font-semibold
                                    text-[#355e3b]
                                    transition
                                    hover:text-[#d97706]
                                  "
                                >
                                  {
                                    category.title
                                  }
                                </Link>

                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleMobileCategory(
                                      category.title
                                    )
                                  }
                                  aria-expanded={
                                    isOpen
                                  }
                                  aria-label={
                                    isOpen
                                      ? `بستن ${category.title}`
                                      : `باز کردن ${category.title}`
                                  }
                                  className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    text-[#355e3b]
                                  "
                                >
                                  <ChevronDown
                                    size={
                                      16
                                    }
                                    className={`
                                      transition-transform
                                      duration-300
                                      ${
                                        isOpen
                                          ? "rotate-180 text-[#d97706]"
                                          : ""
                                      }
                                    `}
                                  />
                                </button>
                              </div>

                              <div
                                className={`
                                  grid
                                  transition-all
                                  duration-300
                                  ${
                                    isOpen
                                      ? "grid-rows-[1fr] opacity-100"
                                      : "grid-rows-[0fr] opacity-0"
                                  }
                                `}
                              >
                                <div className="min-h-0 overflow-hidden">
                                  <div
                                    className="
                                      mr-3
                                      space-y-1
                                      border-r
                                      border-[#d97706]/10
                                      pr-3
                                    "
                                  >
                                    <Link
                                      href={`/shop?category=${encodeURIComponent(
                                        category.slug
                                      )}`}
                                      onClick={
                                        closeMobileMenu
                                      }
                                      className="
                                        block
                                        rounded-lg
                                        px-3
                                        py-2
                                        text-xs
                                        text-slate-500
                                        transition
                                        hover:bg-[#f8f5ed]
                                        hover:text-[#d97706]
                                      "
                                    >
                                      همه محصولات{" "}
                                      {
                                        category.title
                                      }
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )
                    )}

                    {/* All Products */}

                    <Link
                      href="/shop"
                      onClick={
                        closeMobileMenu
                      }
                      className="
                        mt-2
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        bg-[#f8f5ed]
                        px-3
                        py-3
                        text-xs
                        font-bold
                        text-[#355e3b]
                        transition
                        hover:text-[#d97706]
                      "
                    >
                      <span>
                        مشاهده همه محصولات
                      </span>

                      <span>←</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* =============================================================== */}
            {/* Other Mobile Links                                               */}
            {/* =============================================================== */}

            {navLinks
              .slice(1)
              .map((item) => {
                const isActive =
                  pathname ===
                  item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={
                      closeMobileMenu
                    }
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
              onClick={() => {
                openSearch();
                setOpen(false);
              }}
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
