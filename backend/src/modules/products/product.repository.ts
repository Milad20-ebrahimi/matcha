import {
  and,
  desc,
  eq,
  ilike,
} from "drizzle-orm";

import { db } from "../../database/index.js";

import {
  products,
  categories,
  brands,
} from "../../database/schema/index.js";

export async function findAllProducts(
  options?: {
    categoryId?: string;
    brandId?: string;
    search?: string;
    activeOnly?: boolean;
  }
) {
  const conditions = [];

  if (options?.categoryId) {
    conditions.push(
      eq(
        products.categoryId,
        options.categoryId
      )
    );
  }

  if (options?.brandId) {
    conditions.push(
      eq(
        products.brandId,
        options.brandId
      )
    );
  }

  if (options?.search) {
    conditions.push(
      ilike(
        products.name,
        `%${options.search}%`
      )
    );
  }

  if (options?.activeOnly) {
    conditions.push(
      eq(
        products.isActive,
        true
      )
    );
  }

  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description:
        products.description,
      price: products.price,
      stock: products.stock,
      image: products.image,
      isActive:
        products.isActive,

      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },

      brand: {
        id: brands.id,
        name: brands.name,
        slug: brands.slug,
        logo: brands.logo,
      },
    })
    .from(products)
    .leftJoin(
      categories,
      eq(
        products.categoryId,
        categories.id
      )
    )
    .leftJoin(
      brands,
      eq(
        products.brandId,
        brands.id
      )
    )
    .where(
      conditions.length > 0
        ? and(...conditions)
        : undefined
    )
    .orderBy(
      desc(products.createdAt)
    );
}

export async function findProductById(
  productId: string
) {
  const [product] =
    await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description:
          products.description,
        price: products.price,
        stock: products.stock,
        image: products.image,
        isActive:
          products.isActive,

        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },

        brand: {
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
          logo: brands.logo,
        },
      })
      .from(products)
      .leftJoin(
        categories,
        eq(
          products.categoryId,
          categories.id
        )
      )
      .leftJoin(
        brands,
        eq(
          products.brandId,
          brands.id
        )
      )
      .where(
        eq(
          products.id,
          productId
        )
      )
      .limit(1);

  return product;
}

export async function findProductBySlug(
  slug: string
) {
  const [product] =
    await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description:
          products.description,
        price: products.price,
        stock: products.stock,
        image: products.image,
        isActive:
          products.isActive,

        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },

        brand: {
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
          logo: brands.logo,
        },
      })
      .from(products)
      .leftJoin(
        categories,
        eq(
          products.categoryId,
          categories.id
        )
      )
      .leftJoin(
        brands,
        eq(
          products.brandId,
          brands.id
        )
      )
      .where(
        eq(
          products.slug,
          slug
        )
      )
      .limit(1);

  return product;
}

export async function createProduct(
  data: {
    categoryId: string;
    brandId?: string | null;
    name: string;
    slug: string;
    description?: string | null;
    price: number;
    stock?: number;
    image?: string | null;
    isActive?: boolean;
  }
) {
  const [product] =
    await db
      .insert(products)
      .values({
        categoryId:
          data.categoryId,

        brandId:
          data.brandId ?? null,

        name:
          data.name,

        slug:
          data.slug,

        description:
          data.description ?? null,

        price:
          data.price,

        stock:
          data.stock ?? 0,

        image:
          data.image ?? null,

        isActive:
          data.isActive ?? true,
      })
      .returning();

  if (!product) {
    throw new Error(
      "Failed to create product."
    );
  }

  return product;
}

export async function updateProduct(
  productId: string,
  data: {
    categoryId?: string;
    brandId?: string | null;
    name?: string;
    slug?: string;
    description?: string | null;
    price?: number;
    stock?: number;
    image?: string | null;
    isActive?: boolean;
  }
) {
  const [product] =
    await db
      .update(products)
      .set({
        ...data,
        updatedAt:
          new Date(),
      })
      .where(
        eq(
          products.id,
          productId
        )
      )
      .returning();

  if (!product) {
    throw new Error(
      "Product not found."
    );
  }

  return product;
}

export async function deleteProduct(
  productId: string
) {
  const [product] =
    await db
      .delete(products)
      .where(
        eq(
          products.id,
          productId
        )
      )
      .returning();

  if (!product) {
    throw new Error(
      "Product not found."
    );
  }

  return product;
}