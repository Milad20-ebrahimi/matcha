import {
  createProduct,
  deleteProduct,
  findAllProducts,
  findProductById,
  findProductBySlug,
  updateProduct,
} from "./product.repository.js";

type CreateProductInput = {
  categoryId: string;
  brandId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  stock?: number;
  image?: string | null;
  isActive?: boolean;
};

type UpdateProductInput = {
  categoryId?: string;
  brandId?: string | null;
  name?: string;
  slug?: string;
  description?: string | null;
  price?: number;
  stock?: number;
  image?: string | null;
  isActive?: boolean;
};

export async function getProducts(
  options?: {
    categoryId?: string;
    brandId?: string;
    search?: string;
    activeOnly?: boolean;
  }
) {
  return findAllProducts(options);
}

export async function getProductById(
  productId: string
) {
  const product =
    await findProductById(productId);

  if (!product) {
    throw new Error(
      "Product not found."
    );
  }

  return product;
}

export async function getProductBySlug(
  slug: string
) {
  const product =
    await findProductBySlug(slug);

  if (!product) {
    throw new Error(
      "Product not found."
    );
  }

  return product;
}

export async function createNewProduct(
  data: CreateProductInput
) {
  const name =
    data.name.trim();

  const slug =
    data.slug.trim();

  if (!name) {
    throw new Error(
      "Product name is required."
    );
  }

  if (!slug) {
    throw new Error(
      "Product slug is required."
    );
  }

  if (!data.categoryId) {
    throw new Error(
      "Category is required."
    );
  }

  if (data.price < 0) {
    throw new Error(
      "Product price cannot be negative."
    );
  }

  if (
    data.stock !== undefined &&
    data.stock < 0
  ) {
    throw new Error(
      "Product stock cannot be negative."
    );
  }

  return createProduct({
    ...data,
    name,
    slug,
  });
}

export async function updateExistingProduct(
  productId: string,
  data: UpdateProductInput
) {
  if (
    data.price !== undefined &&
    data.price < 0
  ) {
    throw new Error(
      "Product price cannot be negative."
    );
  }

  if (
    data.stock !== undefined &&
    data.stock < 0
  ) {
    throw new Error(
      "Product stock cannot be negative."
    );
  }

  if (
    data.name !== undefined &&
    !data.name.trim()
  ) {
    throw new Error(
      "Product name cannot be empty."
    );
  }

  if (
    data.slug !== undefined &&
    !data.slug.trim()
  ) {
    throw new Error(
      "Product slug cannot be empty."
    );
  }

  const updateData: UpdateProductInput = {
    ...data,
  };

  if (data.name !== undefined) {
    updateData.name =
      data.name.trim();
  }

  if (data.slug !== undefined) {
    updateData.slug =
      data.slug.trim();
  }

  return updateProduct(
    productId,
    updateData
  );
}

export async function removeProduct(
  productId: string
) {
  return deleteProduct(productId);
}