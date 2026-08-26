import { Router } from "express";

import {
  requireAuth,
} from "../../middleware/auth.middleware.js";

import {
  getCartController,
  addCartItemController,
  updateCartItemController,
  removeCartItemController,
  clearCartController,
} from "./cart.controller.js";

const router = Router();

// GET /api/v1/cart
router.get(
  "/",
  requireAuth,
  getCartController,
);

// POST /api/v1/cart/items
router.post(
  "/items",
  requireAuth,
  addCartItemController,
);

// PATCH /api/v1/cart/items/:productId
router.patch(
  "/items/:productId",
  requireAuth,
  updateCartItemController,
);

// DELETE /api/v1/cart/items/:productId
router.delete(
  "/items/:productId",
  requireAuth,
  removeCartItemController,
);

// DELETE /api/v1/cart
router.delete(
  "/",
  requireAuth,
  clearCartController,
);

export default router;