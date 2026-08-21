import {
  Router,
} from "express";

import {
  getMeController,
  updateMeController,
} from "./user.controller.js";

import {
  requireAuth,
} from "../../middleware/auth.middleware.js";

const router =
  Router();

/**
 * دریافت اطلاعات کاربر
 *
 * GET /api/v1/users/me
 */
router.get(
  "/me",
  requireAuth,
  getMeController
);

/**
 * بروزرسانی اطلاعات کاربر
 *
 * PATCH /api/v1/users/me
 */
router.patch(
  "/me",
  requireAuth,
  updateMeController
);

export default router;