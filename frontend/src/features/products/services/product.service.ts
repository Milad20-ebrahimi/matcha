
import type { Product } from "@/features/products/types";
import { apiRequest } from "@/lib/api/client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000/api/v1";

interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  isActive: boolean;

  category: {
    id: string;
    name: string;
    slug: string;
  } | null;

  brand: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  } | null;
}

interface ProductsResponse {
  success: boolean;
  data: BackendProduct[];
}

interface ProductResponse {
  success: boolean;
  data: BackendProduct;
}

function resolveImageUrl(
  imageUrl: string | null | undefined
): string {
  if (!imageUrl) {
    return "";
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl}`;
}

function mapProduct(
  product: BackendProduct
): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image: resolveImageUrl(product.image),
    isActive: product.isActive,
    category: product.category,
    brand: product.brand,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const data =
    await apiRequest<ProductsResponse>(
      "/products"
    );

  return data.data.map(mapProduct);
}

export async function fetchProductById(
  id: string
): Promise<Product> {
  const data =
    await apiRequest<ProductResponse>(
      `/products/${id}`
    );

  return mapProduct(data.data);
}

export async function fetchProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const products =
    await fetchProducts();

  return products.find(
    (product) =>
      product.slug === slug
  );
}