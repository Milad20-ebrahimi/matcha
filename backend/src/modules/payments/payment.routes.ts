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

/*
 * دریافت اطلاعات یک پرداخت
 *
 * GET /payments/:id
 */
router.get(
  "/:id",
  requireAuth,
  getPaymentController,
);

/*
 * دریافت پرداخت مربوط به یک سفارش
 *
 * GET /payments/order/:orderId
 */
router.get(
  "/order/:orderId",
  requireAuth,
  getPaymentByOrderController,
);

/*
 * تغییر وضعیت پرداخت
 *
 * PATCH /payments/:id/status
 *
 * فعلاً برای تست و مدیریت داخلی.
 */
router.patch(
  "/:id/status",
  requireAuth,
  updatePaymentStatusController,
);

export default router;
