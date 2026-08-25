import type {
  Request,
  Response,
} from "express";

import {
  getBrands,
  getBrandById,
  getBrandBySlug,
} from "./brand.service.js";

export async function getBrandsController(
  req: Request,
  res: Response,
) {
  try {
    const {
      activeOnly,
    } = req.query;

    const brands =
      await getBrands({
        activeOnly:
          activeOnly === "true",
      });

    return res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (error) {
    console.error(
      "Get brands error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get brands.",
    });
  }
}

export async function getBrandByIdController(
  req: Request,
  res: Response,
) {
  try {
    const { id } =
      req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message:
          "Brand id is required.",
      });
    }

    const brand =
      await getBrandById(id);

    return res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    console.error(
      "Get brand by id error:",
      error,
    );

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Brand not found.",
    });
  }
}

export async function getBrandBySlugController(
  req: Request,
  res: Response,
) {
  try {
    const { slug } =
      req.params;

    if (typeof slug !== "string") {
      return res.status(400).json({
        success: false,
        message:
          "Brand slug is required.",
      });
    }

    const brand =
      await getBrandBySlug(slug);

    return res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    console.error(
      "Get brand by slug error:",
      error,
    );

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Brand not found.",
    });
  }
}
