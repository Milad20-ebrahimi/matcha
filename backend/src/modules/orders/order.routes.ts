import { Router } from "express";

import {
  requireAuth,
} from "../../middleware/auth.middleware.js";

import {
  createOrderController,
} from "./order.controller.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  createOrderController,
);

export default router;
