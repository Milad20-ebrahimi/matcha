import {
  findAllBrands,
  findBrandById,
  findBrandBySlug,
} from "./brand.repository.js";

export async function getBrands(
  options?: {
    activeOnly?: boolean;
  },
) {
  return findAllBrands(options);
}

export async function getBrandById(
  brandId: string,
) {
  const brand =
    await findBrandById(brandId);

  if (!brand) {
    throw new Error(
      "Brand not found.",
    );
  }

  return brand;
}

export async function getBrandBySlug(
  slug: string,
) {
  const brand =
    await findBrandBySlug(slug);

  if (!brand) {
    throw new Error(
      "Brand not found.",
    );
  }

  return brand;
}
