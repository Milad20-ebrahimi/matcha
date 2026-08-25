import {
  desc,
  eq,
} from "drizzle-orm";

import { db } from "../../database/index.js";

import {
  categories,
} from "../../database/schema/index.js";

export async function findAllCategories(
  options?: {
    activeOnly?: boolean;
  }
) {
  const conditions = [];

  if (options?.activeOnly) {
    conditions.push(
      eq(
        categories.isActive,
        true
      )
    );
  }

  return db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description:
        categories.description,
      image: categories.image,
      isActive:
        categories.isActive,
    })
    .from(categories)
    .where(
      conditions.length > 0
        ? conditions[0]
        : undefined
    )
    .orderBy(
      desc(categories.createdAt)
    );
}

export async function findCategoryById(
  categoryId: string
) {
  const [category] =
    await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description:
          categories.description,
        image: categories.image,
        isActive:
          categories.isActive,
      })
      .from(categories)
      .where(
        eq(
          categories.id,
          categoryId
        )
      )
      .limit(1);

  return category;
}

export async function findCategoryBySlug(
  slug: string
) {
  const [category] =
    await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description:
          categories.description,
        image: categories.image,
        isActive:
          categories.isActive,
      })
      .from(categories)
      .where(
        eq(
          categories.slug,
          slug
        )
      )
      .limit(1);

  return category;
}