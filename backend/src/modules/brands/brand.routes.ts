import {
  Router,
} from "express";

import {
  getBrandsController,
  getBrandByIdController,
  getBrandBySlugController,
} from "./brand.controller.js";

const router =
  Router();

/**
 * GET /api/v1/brands
 */
router.get(
  "/",
  getBrandsController,
);

/**
 * GET /api/v1/brands/slug/:slug
 */
router.get(
  "/slug/:slug",
  getBrandBySlugController,
);

/**
 * GET /api/v1/brands/:id
 */
router.get(
  "/:id",
  getBrandByIdController,
);

export default router;
