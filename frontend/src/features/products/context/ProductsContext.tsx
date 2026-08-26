"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  Product,
} from "@/features/products/types";

import {
  fetchProducts,
} from "@/features/products/services/product.service";

interface ProductsContextType {
  products: Product[];
  loading: boolean;

  getProductBySlug(
    slug: string
  ): Product | undefined;
}

const ProductsContext =
  createContext<
    ProductsContextType | undefined
  >(undefined);

export function ProductsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error(
          "Failed loading products:",
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function getProductBySlug(
    slug: string
  ): Product | undefined {
    return products.find(
      (product) =>
        product.slug === slug
    );
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        getProductBySlug,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context =
    useContext(ProductsContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside ProductsProvider"
    );
  }

  return context;
}
