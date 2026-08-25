import {
  eq,
  and,
} from "drizzle-orm";

import { db } from "../../database/index.js";
import { brands } from "../../database/schema/brand.schema.js";

export async function findAllBrands(
  options?: {
    activeOnly?: boolean;
  },
) {
  const conditions = [];

  if (options?.activeOnly) {
    conditions.push(
      eq(brands.isActive, true),
    );
  }

  return db
    .select()
    .from(brands)
    .where(
      conditions.length > 0
        ? and(...conditions)
        : undefined,
    )
    .orderBy(brands.name);
}

export async function findBrandById(
  brandId: string,
) {
  const result =
    await db
      .select()
      .from(brands)
      .where(
        eq(brands.id, brandId),
      )
      .limit(1);

  return result[0] ?? null;
}

export async function findBrandBySlug(
  slug: string,
) {
  const result =
    await db
      .select()
      .from(brands)
      .where(
        eq(brands.slug, slug),
      )
      .limit(1);

  return result[0] ?? null;
}
