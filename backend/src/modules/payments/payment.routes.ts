import {
  Router,
} from "express";

import {
  requireAuth,
} from "../../middleware/auth.middleware.js";

import {
  getPaymentController,
  getPaymentByOrderController,
  updatePaymentStatusController,
} from "./payment.controller.js";

const router = Router();

/**
 * GET /payments/order/:orderId
 *
 * دریافت پرداخت مربوط به یک سفارش
 */
router.get(
  "/order/:orderId",
  requireAuth,
  getPaymentByOrderController,
);

/**
 * GET /payments/:id
 *
 * دریافت اطلاعات یک پرداخت
 */
router.get(
  "/:id",
  requireAuth,
  getPaymentController,
);

/**
 * PATCH /payments/:id/status
 *
 * تغییر وضعیت پرداخت
 */
router.patch(
  "/:id/status",
  requireAuth,
  updatePaymentStatusController,
);

export default router;
