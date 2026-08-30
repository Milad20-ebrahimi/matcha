import { Router } from "express";

import {
  requireAuth,
} from "../../middleware/auth.middleware.js";

import {
  createOrderController,
  getOrdersController,
  getOrderController,
} from "./order.controller.js";

const router = Router();

/**
 * POST /orders
 * ایجاد سفارش
 */
router.post(
  "/",
  requireAuth,
  createOrderController,
);

/**
 * GET /orders
 * لیست سفارش‌های کاربر
 */
router.get(
  "/",
  requireAuth,
  getOrdersController,
);

/**
 * GET /orders/:orderId
 * جزئیات یک سفارش
 */
router.get(
  "/:orderId",
  requireAuth,
  getOrderController,
);

export default router;