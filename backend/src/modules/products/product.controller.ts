import type {
  Request,
  Response,
} from "express";

import {
  createNewProduct,
  getProductById,
  getProductBySlug,
  getProducts,
  removeProduct,
  updateExistingProduct,
} from "./product.service.js";

export async function getProductsController(
  req: Request,
  res: Response
) {
  try {
    const {
      categoryId,
      brandId,
      search,
      activeOnly,
    } = req.query;

    const filters: {
      categoryId?: string;
      brandId?: string;
      search?: string;
      activeOnly?: boolean;
    } = {};

    if (typeof categoryId === "string") {
      filters.categoryId = categoryId;
    }

    if (typeof brandId === "string") {
      filters.brandId = brandId;
    }

    if (typeof search === "string") {
      filters.search = search;
    }

    if (activeOnly === "true") {
      filters.activeOnly = true;
    }

    const products =
      await getProducts(filters);

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "خطا در دریافت محصولات.",
    });
  }
}

export async function getProductByIdController(
  req: Request,
  res: Response
) {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !id) {
      return res.status(400).json({
        success: false,
        message:
          "شناسه محصول الزامی است.",
      });
    }

    const product =
      await getProductById(id);

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(
      "Get product by id error:",
      error
    );

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "محصول پیدا نشد.",
    });
  }
}

export async function getProductBySlugController(
  req: Request,
  res: Response
) {
  try {
    const slug = req.params.slug;

    if (typeof slug !== "string" || !slug) {
      return res.status(400).json({
        success: false,
        message:
          "شناسه محصول الزامی است.",
      });
    }

    const product =
      await getProductBySlug(slug);

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(
      "Get product by slug error:",
      error
    );

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "محصول پیدا نشد.",
    });
  }
}

export async function createProductController(
  req: Request,
  res: Response
) {
  try {
    const {
      categoryId,
      brandId,
      name,
      slug,
      description,
      price,
      stock,
      image,
      isActive,
    } = req.body;

    if (
      !categoryId ||
      !name ||
      !slug ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "categoryId، name، slug و price الزامی هستند.",
      });
    }

    const product =
      await createNewProduct({
        categoryId,
        brandId,
        name,
        slug,
        description,
        price,
        stock,
        image,
        isActive,
      });

    return res.status(201).json({
      success: true,
      message:
        "محصول با موفقیت ایجاد شد.",
      data: product,
    });
  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "ایجاد محصول ناموفق بود.",
    });
  }
}

export async function updateProductController(
  req: Request,
  res: Response
) {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !id) {
      return res.status(400).json({
        success: false,
        message:
          "شناسه محصول الزامی است.",
      });
    }

    const product =
      await updateExistingProduct(
        id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "محصول با موفقیت ویرایش شد.",
      data: product,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "ویرایش محصول ناموفق بود.",
    });
  }
}

export async function deleteProductController(
  req: Request,
  res: Response
) {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !id) {
      return res.status(400).json({
        success: false,
        message:
          "شناسه محصول الزامی است.",
      });
    }

    await removeProduct(id);

    return res.status(200).json({
      success: true,
      message:
        "محصول با موفقیت حذف شد.",
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "حذف محصول ناموفق بود.",
    });
  }
}