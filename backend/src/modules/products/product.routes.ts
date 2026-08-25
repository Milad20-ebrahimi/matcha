import { Router } from "express";

import {
  getProductsController,
  getProductByIdController,
  getProductBySlugController,
  createProductController,
  updateProductController,
  deleteProductController,
} from "./product.controller.js";

const router = Router();

// GET /api/v1/products
router.get(
  "/",
  getProductsController,
);

// GET /api/v1/products/slug/:slug
router.get(
  "/slug/:slug",
  getProductBySlugController,
);

// GET /api/v1/products/:id
router.get(
  "/:id",
  getProductByIdController,
);

// POST /api/v1/products
router.post(
  "/",
  createProductController,
);

// PATCH /api/v1/products/:id
router.patch(
  "/:id",
  updateProductController,
);

// DELETE /api/v1/products/:id
router.delete(
  "/:id",
  deleteProductController,
);

export default router;
