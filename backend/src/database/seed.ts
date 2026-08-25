import "dotenv/config";

import { db } from "./index.js";

import { roles } from "./schema/role.schema.js";
import { categories } from "./schema/category.schema.js";
import { brands } from "./schema/brand.schema.js";
import { products } from "./schema/product.schema.js";

const defaultRoles = [
  {
    name: "CUSTOMER",
  },
  {
    name: "ADMIN",
  },
  {
    name: "STAFF",
  },
];

const defaultCategories = [
  {
    name: "ماچا",
    slug: "matcha",
    description: "انواع محصولات و نوشیدنی‌های ماچا",
    image: null,
    isActive: true,
  },
  {
    name: "چای",
    slug: "tea",
    description: "انواع چای و دمنوش",
    image: null,
    isActive: true,
  },
  {
    name: "قهوه",
    slug: "coffee",
    description: "انواع قهوه و محصولات مرتبط",
    image: null,
    isActive: true,
  },
  {
    name: "ابزار دم‌آوری",
    slug: "brewing-tools",
    description: "ابزارهای دم‌آوری قهوه و چای",
    image: null,
    isActive: true,
  },
];

const defaultBrands = [
  {
    name: "Matcha Cafe",
    slug: "matcha-cafe",
    description: "برند کافه و فروشگاه ماچا",
    logo: null,
    isActive: true,
  },
  {
    name: "Hario",
    slug: "hario",
    description: "ابزارهای تخصصی قهوه و دم‌آوری",
    logo: null,
    isActive: true,
  },
  {
    name: "Timemore",
    slug: "timemore",
    description: "ابزارهای حرفه‌ای قهوه",
    logo: null,
    isActive: true,
  },
];

async function seed() {
  console.log("Starting database seed...");

  // Roles
  await db
    .insert(roles)
    .values(defaultRoles)
    .onConflictDoNothing();

  console.log("Roles seeded successfully.");

  // Categories
  await db
    .insert(categories)
    .values(defaultCategories)
    .onConflictDoNothing();

  console.log("Categories seeded successfully.");

  // Brands
  await db
    .insert(brands)
    .values(defaultBrands)
    .onConflictDoNothing();

  console.log("Brands seeded successfully.");

  // Get category IDs
  const categoryRows = await db
    .select()
    .from(categories);

  const brandRows = await db
    .select()
    .from(brands);

  const matchaCategory = categoryRows.find(
    (category) => category.slug === "matcha",
  );

  const teaCategory = categoryRows.find(
    (category) => category.slug === "tea",
  );

  const coffeeCategory = categoryRows.find(
    (category) => category.slug === "coffee",
  );

  const toolsCategory = categoryRows.find(
    (category) =>
      category.slug === "brewing-tools",
  );

  const matchaBrand = brandRows.find(
    (brand) =>
      brand.slug === "matcha-cafe",
  );

  const harioBrand = brandRows.find(
    (brand) => brand.slug === "hario",
  );

  const timemoreBrand = brandRows.find(
    (brand) => brand.slug === "timemore",
  );

  if (
    !matchaCategory ||
    !teaCategory ||
    !coffeeCategory ||
    !toolsCategory ||
    !matchaBrand ||
    !harioBrand ||
    !timemoreBrand
  ) {
    throw new Error(
      "Required categories or brands were not found.",
    );
  }

  const defaultProducts = [
    {
      categoryId: matchaCategory.id,
      brandId: matchaBrand.id,
      name: "ماچا ژاپنی",
      slug: "japanese-matcha",
      description:
        "ماچا ژاپنی با کیفیت مناسب برای نوشیدنی و مصرف روزانه",
      price: 450000,
      stock: 20,
      image: null,
      isActive: true,
    },
    {
      categoryId: matchaCategory.id,
      brandId: matchaBrand.id,
      name: "همزن بامبو ماچا",
      slug: "matcha-bamboo-whisk",
      description:
        "همزن سنتی بامبو برای آماده‌سازی ماچا",
      price: 280000,
      stock: 15,
      image: null,
      isActive: true,
    },
    {
      categoryId: teaCategory.id,
      brandId: matchaBrand.id,
      name: "چای سبز ژاپنی",
      slug: "japanese-green-tea",
      description:
        "چای سبز ژاپنی با عطر و طعم ملایم",
      price: 320000,
      stock: 25,
      image: null,
      isActive: true,
    },
    {
      categoryId: coffeeCategory.id,
      brandId: matchaBrand.id,
      name: "قهوه اسپشیالتی",
      slug: "specialty-coffee",
      description:
        "قهوه اسپشیالتی مناسب برای دم‌آوری دستی",
      price: 550000,
      stock: 18,
      image: null,
      isActive: true,
    },
    {
      categoryId: toolsCategory.id,
      brandId: harioBrand.id,
      name: "V60",
      slug: "hario-v60",
      description:
        "ابزار محبوب دم‌آوری قهوه به روش V60",
      price: 850000,
      stock: 10,
      image: null,
      isActive: true,
    },
    {
      categoryId: toolsCategory.id,
      brandId: timemoreBrand.id,
      name: "ترازو قهوه",
      slug: "timemore-coffee-scale",
      description:
        "ترازوی دقیق برای دم‌آوری حرفه‌ای قهوه",
      price: 3200000,
      stock: 8,
      image: null,
      isActive: true,
    },
  ];

  await db
    .insert(products)
    .values(defaultProducts)
    .onConflictDoNothing();

  console.log("Products seeded successfully.");

  console.log("Database seed completed successfully.");
}

seed()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(() => {
    console.log("Seed finished.");
  });