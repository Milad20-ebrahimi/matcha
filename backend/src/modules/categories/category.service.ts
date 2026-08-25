import {
  findAllCategories,
  findCategoryById,
  findCategoryBySlug,
} from "./category.repository.js";

export async function getCategories(
  options?: {
    activeOnly?: boolean;
  }
) {
  return findAllCategories(
    options
  );
}

export async function getCategoryById(
  categoryId: string
) {
  const category =
    await findCategoryById(
      categoryId
    );

  if (!category) {
    throw new Error(
      "Category not found."
    );
  }

  return category;
}

export async function getCategoryBySlug(
  slug: string
) {
  const category =
    await findCategoryBySlug(
      slug
    );

  if (!category) {
    throw new Error(
      "Category not found."
    );
  }

  return category;
}
