"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import Container from "@/components/shared/Container";
import ShopSidebar, {
type ShopCategory,
type ShopPriceRange,
} from "@/components/shop/ShopSidebar";

import { useProducts } from "@/features/products/context/ProductsContext";

export default function ShopPage() {
const { products, loading } = useProducts();

const [category, setCategory] =
useState<ShopCategory>("all");

const [priceRange, setPriceRange] =
useState<ShopPriceRange>("all");

const [onlyAvailable, setOnlyAvailable] =
useState(false);

const [sidebarOpen, setSidebarOpen] =
useState(false);

/*

* ---
* Filter Products
* ---

*/

const filteredProducts = useMemo(() => {
return products.filter((product) => {
/*
* Category
*/

  if (category !== "all") {
    const categorySlug =
      product.category?.slug?.toLowerCase();

    const categoryName =
      product.category?.name?.toLowerCase();

    const selectedCategory =
      category.toLowerCase();

    if (
      categorySlug !== selectedCategory &&
      categoryName !== selectedCategory
    ) {
      return false;
    }
  }

  /*
   * Price
   */

  const price = product.price;

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
   * Availability
   */

  if (onlyAvailable) {
    if (
      !product.isActive ||
      product.stock <= 0
    ) {
      return false;
    }
  }

  return true;
});

}, [
products,
category,
priceRange,
onlyAvailable,
]);

/*

* ---
* Check Active Filters
* ---

*/

const hasActiveFilters =
category !== "all" ||
priceRange !== "all" ||
onlyAvailable;

/*

* ---
* Reset Filters
* ---

*/

const handleReset = () => {
setCategory("all");
setPriceRange("all");
setOnlyAvailable(false);
};

return ( <main
  dir="rtl"
  className="
    min-h-screen
    bg-[#f8f5ed]
    pb-10
    pt-20
    sm:pb-14
    sm:pt-24
  "
> <Container>

    {/* Header */}

    <div className="mb-8">
      <div className="flex items-center justify-end">

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

    {/* Shop Layout */}

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
          setCategory
        }
        onPriceRangeChange={
          setPriceRange
        }
        onAvailabilityChange={
          setOnlyAvailable
        }
        onReset={handleReset}
      />

      {/* -------------------------------- */}
      {/* Products */}
      {/* -------------------------------- */}

      <section>

        {/* -------------------------------- */}
        {/* Active Filters */}
        {/* -------------------------------- */}

        {hasActiveFilters && (
          <div
            className="
              mb-6
              flex
              items-center
              justify-start
            "
          >
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
          </div>
        )}

        {/* -------------------------------- */}
        {/* Loading */}
        {/* -------------------------------- */}

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

        {/* -------------------------------- */}
        {/* Empty State */}
        {/* -------------------------------- */}

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
                <SlidersHorizontal
                  size={24}
                />
              </div>

              <h2
                className="
                  mt-5
                  text-lg
                  font-semibold
                  text-[#0d1a12]
                "
              >
                محصولی پیدا نشد
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
                با تغییر فیلترها می‌توانید
                محصولات بیشتری را مشاهده کنید.
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

        {/* -------------------------------- */}
        {/* Products Grid */}
        {/* -------------------------------- */}

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

                      {product.stock <= 0 && (
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
                          {product.category.name}
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
                          {product.description}
                        </p>
                      )}

                      {/* Price + Button */}

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

                          {/* Old Price */}

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

                          {/* Current Price */}

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

                        {/* Product Link */}

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
