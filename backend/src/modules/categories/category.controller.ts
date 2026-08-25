import type {
  Request,
  Response,
} from "express";

import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
} from "./category.service.js";

export async function getCategoriesController(
  req: Request,
  res: Response
) {
  try {
    const {
      activeOnly,
    } = req.query;

    const categories =
      await getCategories({
        activeOnly:
          activeOnly === "true",
      });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(
      "Get categories error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get categories.",
    });
  }
}

export async function getCategoryByIdController(
  req: Request,
  res: Response
) {
  try {
    const { id } =
      req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message:
          "Category id is required.",
      });
    }

    const category =
      await getCategoryById(id);

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(
      "Get category by id error:",
      error
    );

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Category not found.",
    });
  }
}

export async function getCategoryBySlugController(
  req: Request,
  res: Response
) {
  try {
    const { slug } =
      req.params;

    if (typeof slug !== "string") {
      return res.status(400).json({
        success: false,
        message:
          "Category slug is required.",
      });
    }

    const category =
      await getCategoryBySlug(
        slug
      );

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(
      "Get category by slug error:",
      error
    );

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Category not found.",
    });
  }
}