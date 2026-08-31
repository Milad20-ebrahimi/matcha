"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search } from "lucide-react";

import Container from "@/components/shared/Container";
import ShopSidebar, {
  type ShopCategory,
  type ShopPriceRange,
} from "@/components/shop/ShopSidebar";

import { useProducts } from "@/features/products/context/ProductsContext";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const CATEGORY_SEARCH_MAP: Record<
  Exclude<ShopCategory, "all">,
  string[]
> = {
  Matcha: ["ماچا", "matcha"],
  Coffee: ["قهوه", "coffee"],
  Tea: ["چای", "tea", "دمنوش"],
  Accessories: [
    "ابزار",
    "ابزار دم‌آوری",
    "لوازم جانبی",
    "accessories",
  ],
};

const normalizeText = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ");
};

/**
 * تشخیص دسته‌بندی از روی عبارت جستجو
 *
 * مثلا:
 * "قهوه" -> Coffee
 * "ماچا" -> Matcha
 */
const getCategoryFromSearch = (
  search: string
): ShopCategory => {
  const normalizedSearch = normalizeText(search);

  if (!normalizedSearch) {
    return "all";
  }

  for (const [category, keywords] of Object.entries(
    CATEGORY_SEARCH_MAP
  )) {
    const matched = keywords.some(
      (keyword) =>
        normalizedSearch === normalizeText(keyword)
    );

    if (matched) {
      return category as ShopCategory;
    }
  }

  return "all";
};

/**
 * تبدیل category به slug مناسب URL
 */
const categoryToUrl = (
  category: ShopCategory
) => {
  if (category === "all") {
    return null;
  }

  return category.toLowerCase();
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function ShopPage() {
  const { products, loading } = useProducts();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
   * ------------------------------------------------------------------------
   * URL Values
   * ------------------------------------------------------------------------
   */

  const searchQuery =
    searchParams.get("search")?.trim() ?? "";

  const urlCategory =
    searchParams.get("category")?.trim() ?? "";

  const urlPrice =
    searchParams.get("price")?.trim() ?? "";

  const urlAvailable =
    searchParams.get("available") === "true";

  /*
   * ------------------------------------------------------------------------
   * Initial Category
   *
   * اگر category در URL وجود داشته باشد از آن استفاده می‌کنیم.
   *
   * اگر category وجود نداشته باشد ولی search مثلا "قهوه" باشد،
   * دسته‌بندی Coffee به صورت خودکار فعال می‌شود.
   * ------------------------------------------------------------------------
   */

  const detectedCategory =
    getCategoryFromSearch(searchQuery);

  const initialCategory: ShopCategory =
    urlCategory === "matcha"
      ? "Matcha"
      : urlCategory === "coffee"
        ? "Coffee"
        : urlCategory === "tea"
          ? "Tea"
: urlCategory === "accessories"
  ? "Accessories"
  : detectedCategory;

  /*
   * ------------------------------------------------------------------------
   * State
   * ------------------------------------------------------------------------
   */

  const [category, setCategory] =
    useState<ShopCategory>(initialCategory);

  const [priceRange, setPriceRange] =
    useState<ShopPriceRange>(
      urlPrice === "under-500" ||
        urlPrice === "500-1000" ||
        urlPrice === "1000-2000" ||
        urlPrice === "over-2000"
        ? (urlPrice as ShopPriceRange)
        : "all"
    );

  const [onlyAvailable, setOnlyAvailable] =
    useState(urlAvailable);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  /*
   * ------------------------------------------------------------------------
   * Update URL
   * ------------------------------------------------------------------------
   */

  const updateUrl = ({
    nextCategory = category,
    nextPriceRange = priceRange,
    nextOnlyAvailable = onlyAvailable,
    clearSearch = false,
  }: {
    nextCategory?: ShopCategory;
    nextPriceRange?: ShopPriceRange;
    nextOnlyAvailable?: boolean;
    clearSearch?: boolean;
  } = {}) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    /*
     * Category
     */

    const categorySlug =
      categoryToUrl(nextCategory);

    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }

    /*
     * Search
     */

    if (clearSearch) {
      params.delete("search");
    }

    /*
     * Price
     */

    if (nextPriceRange !== "all") {
      params.set("price", nextPriceRange);
    } else {
      params.delete("price");
    }

    /*
     * Availability
     */

    if (nextOnlyAvailable) {
      params.set("available", "true");
    } else {
      params.delete("available");
    }

    const queryString =
      params.toString();

    router.push(
      queryString
        ? `${pathname}?${queryString}`
        : pathname,
      {
        scroll: false,
      }
    );
  };

  /*
   * ------------------------------------------------------------------------
   * Category Change
   *
   * نکته مهم:
   *
   * وقتی کاربر از Search وارد شده و دسته‌بندی جدیدی انتخاب می‌کند،
   * Search قبلی باید حذف شود.
   *
   * مثلا:
   *
   * /shop?search=قهوه
   *
   * کلیک روی ماچا:
   *
   * /shop?category=matcha
   * ------------------------------------------------------------------------
   */

  const handleCategoryChange = (
    nextCategory: ShopCategory
  ) => {
    setCategory(nextCategory);

    updateUrl({
      nextCategory,
      clearSearch: true,
    });

    /*
     * در موبایل بعد از انتخاب دسته‌بندی،
     * سایدبار بسته شود.
     */

    setSidebarOpen(false);
  };

  /*
   * ------------------------------------------------------------------------
   * Price Change
   * ------------------------------------------------------------------------
   */

  const handlePriceChange = (
    nextPriceRange: ShopPriceRange
  ) => {
    setPriceRange(nextPriceRange);

    updateUrl({
      nextPriceRange,
    });
  };

  /*
   * ------------------------------------------------------------------------
   * Availability Change
   * ------------------------------------------------------------------------
   */

  const handleAvailabilityChange = (
    value: boolean
  ) => {
    setOnlyAvailable(value);

    updateUrl({
      nextOnlyAvailable: value,
    });
  };

  /*
   * ------------------------------------------------------------------------
   * Search
   * ------------------------------------------------------------------------
   */

  const normalizedSearchQuery =
    normalizeText(searchQuery);

  /*
   * ------------------------------------------------------------------------
   * Filter Products
   * ------------------------------------------------------------------------
   */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      /*
       * --------------------------------------------------------------
       * Search
       *
       * Search فقط زمانی اعمال می‌شود که search در URL وجود داشته باشد.
       * --------------------------------------------------------------
       */

      if (normalizedSearchQuery) {
        const name = normalizeText(
          product.name ?? ""
        );

        const description = normalizeText(
          product.description ?? ""
        );

        const categoryName = normalizeText(
          product.category?.name ?? ""
        );

        const categorySlug = normalizeText(
          product.category?.slug ?? ""
        );

        const slug = normalizeText(
          product.slug ?? ""
        );

        const matchesSearch =
          name.includes(
            normalizedSearchQuery
          ) ||
          description.includes(
            normalizedSearchQuery
          ) ||
          categoryName.includes(
            normalizedSearchQuery
          ) ||
          categorySlug.includes(
            normalizedSearchQuery
          ) ||
          slug.includes(
            normalizedSearchQuery
          );

        if (!matchesSearch) {
          return false;
        }
      }

      /*
       * --------------------------------------------------------------
       * Category
       *
       * اگر کاربر category را انتخاب کرده باشد،
       * Search دیگر نباید مزاحم آن شود.
       *
       * چون هنگام تغییر دسته‌بندی Search از URL حذف می‌شود.
       * --------------------------------------------------------------
       */

      if (category !== "all") {
        const productCategorySlug =
          normalizeText(
            product.category?.slug ?? ""
          );

        const productCategoryName =
          normalizeText(
            product.category?.name ?? ""
          );

        const selectedCategory =
          normalizeText(category);

        /*
         * Mapping برای حالت‌هایی که slug دیتابیس
         * با نام TypeScript متفاوت است.
         */

        const categoryAliases: Record<
          Exclude<ShopCategory, "all">,
          string[]
        > = {
          Matcha: [
            "matcha",
            "ماچا",
          ],
          Coffee: [
            "coffee",
            "قهوه",
          ],
          Tea: [
            "tea",
            "چای",
            "دمنوش",
          ],
Accessories: [
  "accessories",
  "tools",
  "brewing-tools",
  "ابزار",
  "ابزار دم‌آوری",
  "لوازم جانبی",
],
        
        };

        const aliases =
          categoryAliases[
            category as Exclude<
              ShopCategory,
              "all"
            >
          ] ?? [selectedCategory];

        const matchesCategory =
          aliases.some(
            (alias) =>
              productCategorySlug ===
                normalizeText(alias) ||
              productCategoryName ===
                normalizeText(alias)
          );

        if (!matchesCategory) {
          return false;
        }
      }

      /*
       * --------------------------------------------------------------
       * Price
       * --------------------------------------------------------------
       */

      const price = Number(
        product.price ?? 0
      );

      if (priceRange === "under-500") {
        if (price >= 500000) {
          return false;
        }
      }

      if (priceRange === "500-1000") {
        if (
          price < 500000 ||
          price >= 1000000
        ) {
          return false;
        }
      }

      if (priceRange === "1000-2000") {
        if (
          price < 1000000 ||
          price >= 2000000
        ) {
          return false;
        }
      }

      if (priceRange === "over-2000") {
        if (price < 2000000) {
          return false;
        }
      }

      /*
       * --------------------------------------------------------------
       * Availability
       * --------------------------------------------------------------
       */

      if (onlyAvailable) {
        if (
          !product.isActive ||
          Number(product.stock ?? 0) <= 0
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    products,
    normalizedSearchQuery,
    category,
    priceRange,
    onlyAvailable,
  ]);

  /*
   * ------------------------------------------------------------------------
   * Active Filters
   * ------------------------------------------------------------------------
   */

  const hasActiveFilters =
    category !== "all" ||
    priceRange !== "all" ||
    onlyAvailable;

  /*
   * ------------------------------------------------------------------------
   * Reset
   *
   * همه فیلترها + Search پاک می‌شوند.
   * ------------------------------------------------------------------------
   */

  const handleReset = () => {
    setCategory("all");
    setPriceRange("all");
    setOnlyAvailable(false);

    router.push(pathname, {
      scroll: false,
    });

    setSidebarOpen(false);
  };

  /*
   * ------------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------------
   */

  return (
    <main
      dir="rtl"
      className="
        min-h-screen
        bg-[#f8f5ed]
        pb-10
        pt-20
        sm:pb-14
        sm:pt-24
      "
    >
      <Container>
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1
                className="
                  text-2xl
                  font-bold
                  text-[#0d1a12]
                  sm:text-3xl
                "
              >
                فروشگاه
              </h1>

              {searchQuery && (
                <div
                  className="
                    mt-2
                    flex
                    flex-wrap
                    items-center
                    gap-2
                    text-sm
                    text-[#0d1a12]/50
                  "
                >
                  <Search size={15} />

                  <span>
                    نتایج جستجو برای:
                  </span>

                  <strong className="text-[#355e3b]">
                    «{searchQuery}»
                  </strong>
                </div>
              )}

              {category !== "all" &&
                !searchQuery && (
                  <p
                    className="
                      mt-2
                      text-sm
                      text-[#0d1a12]/50
                    "
                  >
                    محصولات دسته‌بندی{" "}
                    <strong className="text-[#355e3b]">
                      {
{
  Matcha: "ماچا",
  Coffee: "قهوه",
  Tea: "چای",
  Accessories: "ابزار دم‌آوری",
}[category]
                      }
                    </strong>
                  </p>
                )}
            </div>

            {/* Mobile Filter Button */}

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-full
                bg-[#0d1a12]
                px-5
                py-3
                text-sm
                font-medium
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:bg-[#355e3b]
                lg:hidden
              "
            >
              <SlidersHorizontal size={17} />
              فیلترها
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Layout                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div
          className="
            grid
            items-start
            gap-8
            lg:grid-cols-[280px_minmax(0,1fr)]
          "
        >
          {/* Sidebar */}

          <ShopSidebar
            open={sidebarOpen}
            onClose={() =>
              setSidebarOpen(false)
            }
            category={category}
            priceRange={priceRange}
            onlyAvailable={onlyAvailable}
            onCategoryChange={
              handleCategoryChange
            }
            onPriceRangeChange={
              handlePriceChange
            }
            onAvailabilityChange={
              handleAvailabilityChange
            }
            onReset={handleReset}
          />

          {/* Products */}

          <section>
            {/* Active Filters */}

            {(hasActiveFilters ||
              searchQuery) && (
              <div
                className="
                  mb-6
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-3
                "
              >
                <p
                  className="
                    text-xs
                    text-[#0d1a12]/50
                  "
                >
                  {loading
                    ? "در حال بارگذاری..."
                    : `${filteredProducts.length.toLocaleString(
                        "fa-IR"
                      )} محصول پیدا شد`}
                </p>

                {(hasActiveFilters ||
                  searchQuery) && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="
                      rounded-full
                      border
                      border-[#0d1a12]/15
                      bg-white/70
                      px-5
                      py-2.5
                      text-xs
                      font-medium
                      text-[#355e3b]
                      transition-all
                      duration-300
                      hover:border-[#0d1a12]
                      hover:bg-[#0d1a12]
                      hover:text-white
                    "
                  >
                    حذف فیلترها
                  </button>
                )}
              </div>
            )}

            {/* Loading */}

            {loading && (
              <div
                className="
                  grid
                  grid-cols-1
                  gap-5
                  sm:grid-cols-2
                  xl:grid-cols-3
                "
              >
                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-[#0d1a12]/10
                      bg-white
                    "
                  >
                    <div
                      className="
                        aspect-square
                        animate-pulse
                        bg-[#e8e1d3]
                      "
                    />

                    <div className="space-y-3 p-5">
                      <div
                        className="
                          h-4
                          w-2/3
                          animate-pulse
                          rounded
                          bg-[#e8e1d3]
                        "
                      />

                      <div
                        className="
                          h-4
                          w-1/3
                          animate-pulse
                          rounded
                          bg-[#e8e1d3]
                        "
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}

            {!loading &&
              filteredProducts.length === 0 && (
                <div
                  className="
                    flex
                    min-h-[400px]
                    flex-col
                    items-center
                    justify-center
                    rounded-[32px]
                    border
                    border-[#0d1a12]/10
                    bg-white/70
                    px-6
                    text-center
                  "
                >
                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f2e9d8]
                      text-[#355e3b]
                    "
                  >
                    <Search size={24} />
                  </div>

                  <h2
                    className="
                      mt-5
                      text-lg
                      font-semibold
                      text-[#0d1a12]
                    "
                  >
                    {searchQuery
                      ? "نتیجه‌ای پیدا نشد"
                      : "محصولی پیدا نشد"}
                  </h2>

                  <p
                    className="
                      mt-2
                      max-w-md
                      text-sm
                      leading-7
                      text-[#0d1a12]/50
                    "
                  >
                    {searchQuery
                      ? `برای «${searchQuery}» محصولی پیدا نشد. عبارت دیگری را امتحان کنید.`
                      : "با تغییر فیلترها می‌توانید محصولات بیشتری را مشاهده کنید."}
                  </p>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="
                      mt-6
                      rounded-full
                      bg-[#0d1a12]
                      px-6
                      py-3
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-[#355e3b]
                    "
                  >
                    نمایش همه محصولات
                  </button>
                </div>
              )}

            {/* Products Grid */}

            {!loading &&
              filteredProducts.length > 0 && (
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-5
                    sm:grid-cols-2
                    xl:grid-cols-3
                  "
                >
                  {filteredProducts.map(
                    (product) => (
                      <article
                        key={product.id}
                        className="
                          group
                          overflow-hidden
                          rounded-[28px]
                          border
                          border-[#0d1a12]/10
                          bg-white
                          shadow-[0_20px_50px_-35px_rgba(13,26,18,0.35)]
                          transition-all
                          duration-500
                          hover:-translate-y-1
                          hover:shadow-[0_25px_60px_-30px_rgba(13,26,18,0.4)]
                        "
                      >
                        {/* Image */}

                        <div
                          className="
                            relative
                            aspect-square
                            overflow-hidden
                            bg-[#f2e9d8]
                          "
                        >
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="
                                h-full
                                w-full
                                object-cover
                                transition
                                duration-700
                                group-hover:scale-105
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex
                                h-full
                                items-center
                                justify-center
                                text-sm
                                text-[#0d1a12]/40
                              "
                            >
                              بدون تصویر
                            </div>
                          )}

                          {/* Badge */}

                          {product.badge && (
                            <span
                              className="
                                absolute
                                right-4
                                top-4
                                rounded-full
                                bg-[#0d1a12]
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                text-white
                              "
                            >
                              {product.badge}
                            </span>
                          )}

                          {/* Out of Stock */}

                          {Number(
                            product.stock ?? 0
                          ) <= 0 && (
                            <div
                              className="
                                absolute
                                inset-0
                                flex
                                items-center
                                justify-center
                                bg-[#0d1a12]/45
                                backdrop-blur-[2px]
                              "
                            >
                              <span
                                className="
                                  rounded-full
                                  bg-white
                                  px-4
                                  py-2
                                  text-xs
                                  font-medium
                                  text-[#0d1a12]
                                "
                              >
                                ناموجود
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}

                        <div className="p-5">
                          {/* Category */}

                          {product.category && (
                            <p
                              className="
                                text-[11px]
                                font-medium
                                tracking-wide
                                text-[#b58a47]
                              "
                            >
                              {
                                product.category
                                  .name
                              }
                            </p>
                          )}

                          {/* Name */}

                          <h2
                            className="
                              mt-2
                              line-clamp-1
                              text-base
                              font-semibold
                              text-[#0d1a12]
                            "
                          >
                            {product.name}
                          </h2>

                          {/* Description */}

                          {product.description && (
                            <p
                              className="
                                mt-2
                                line-clamp-2
                                text-xs
                                leading-6
                                text-[#0d1a12]/50
                              "
                            >
                              {
                                product.description
                              }
                            </p>
                          )}

                          {/* Price */}

                          <div
                            className="
                              mt-5
                              flex
                              items-center
                              justify-between
                              gap-3
                            "
                          >
                            <div>
                              {product.oldPrice &&
                                product.oldPrice >
                                  product.price && (
                                  <span
                                    className="
                                      block
                                      text-xs
                                      text-[#0d1a12]/35
                                      line-through
                                    "
                                  >
                                    {product.oldPrice.toLocaleString(
                                      "fa-IR"
                                    )}{" "}
                                    تومان
                                  </span>
                                )}

                              <span
                                className="
                                  text-sm
                                  font-bold
                                  text-[#355e3b]
                                "
                              >
                                {product.price.toLocaleString(
                                  "fa-IR"
                                )}{" "}
                                تومان
                              </span>
                            </div>

                            <a
                              href={`/shop/${product.slug}`}
                              className="
                                rounded-full
                                bg-[#0d1a12]
                                px-4
                                py-2.5
                                text-xs
                                font-medium
                                text-white
                                transition
                                hover:bg-[#355e3b]
                              "
                            >
                              مشاهده محصول
                            </a>
                          </div>
                        </div>
                      </article>
                    )
                  )}
                </div>
              )}
          </section>
        </div>
      </Container>
    </main>
  );
}
