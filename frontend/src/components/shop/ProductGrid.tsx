
"use client";

import { useProducts } from "@/features/products/context/ProductsContext";

import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div
        dir="rtl"
        className="
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="
              overflow-hidden
              rounded-[2rem]
              border
              border-[#203c27]/10
              bg-white
            "
          >
            <div className="aspect-square animate-pulse bg-[#f1eade]" />

            <div className="space-y-4 p-5">
              <div className="h-3 w-20 animate-pulse rounded-full bg-[#f1eade]" />

              <div className="h-6 w-3/4 animate-pulse rounded-full bg-[#f1eade]" />

              <div className="h-10 animate-pulse rounded-xl bg-[#f1eade]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        dir="rtl"
        className="
          rounded-[2rem]
          border
          border-[#203c27]/10
          bg-white
          px-6
          py-20
          text-center
        "
      >
        <div className="text-5xl">🍵</div>

        <h2
          className="
            mt-5
            text-2xl
            font-bold
            text-[#203c27]
          "
        >
          محصولی پیدا نشد
        </h2>

        <p className="mt-3 text-sm text-[#203c27]/60">
          در حال حاضر محصولی برای نمایش وجود ندارد.
        </p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {products
        .filter((product) => product.isActive)
        .map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
    </div>
  );
}
