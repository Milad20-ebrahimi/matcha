import type {
  GetProductsParams,
  ProductResponse,
  ProductsResponse,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

function buildQuery(
  params?: GetProductsParams,
) {
  const searchParams =
    new URLSearchParams();

  if (params?.categoryId) {
    searchParams.set(
      "categoryId",
      params.categoryId,
    );
  }

  if (params?.brandId) {
    searchParams.set(
      "brandId",
      params.brandId,
    );
  }

  if (params?.search) {
    searchParams.set(
      "search",
      params.search,
    );
  }

  if (params?.activeOnly) {
    searchParams.set(
      "activeOnly",
      "true",
    );
  }

  const query =
    searchParams.toString();

  return query
    ? `?${query}`
    : "";
}

export async function getProducts(
  params?: GetProductsParams,
): Promise<ProductsResponse> {
  const response =
    await fetch(
      `${API_URL}/api/v1/products${buildQuery(params)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

  if (!response.ok) {
    throw new Error(
      "دریافت محصولات با خطا مواجه شد.",
    );
  }

  return response.json();
}

export async function getProductById(
  id: string,
): Promise<ProductResponse> {
  const response =
    await fetch(
      `${API_URL}/api/v1/products/${id}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

  if (!response.ok) {
    throw new Error(
      "محصول پیدا نشد.",
    );
  }

  return response.json();
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductResponse> {
  const response =
    await fetch(
      `${API_URL}/api/v1/products/slug/${slug}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

  if (!response.ok) {
    throw new Error(
      "محصول پیدا نشد.",
    );
  }

  return response.json();
}   