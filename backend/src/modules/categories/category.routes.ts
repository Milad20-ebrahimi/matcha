import {
  Router,
} from "express";

import {
  getCategoriesController,
  getCategoryByIdController,
  getCategoryBySlugController,
} from "./category.controller.js";

const router =
  Router();

/**
 * GET /api/v1/categories
 */
router.get(
  "/",
  getCategoriesController
);

/**
 * GET /api/v1/categories/:id
 */
router.get(
  "/:id",
  getCategoryByIdController
);

/**
 * GET /api/v1/categories/slug/:slug
 */
router.get(
  "/slug/:slug",
  getCategoryBySlugController
);

export default router;