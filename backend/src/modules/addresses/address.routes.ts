import { Router } from "express";

import {
  requireAuth,
} from "../../middleware/auth.middleware.js";

import {
  getAddressesController,
  createAddressController,
  updateAddressController,
  deleteAddressController,
  setDefaultAddressController,
} from "./address.controller.js";

const router = Router();

// GET /api/v1/addresses
router.get(
  "/",
  requireAuth,
  getAddressesController,
);

// POST /api/v1/addresses
router.post(
  "/",
  requireAuth,
  createAddressController,
);

// PATCH /api/v1/addresses/:id
router.patch(
  "/:id",
  requireAuth,
  updateAddressController,
);

// DELETE /api/v1/addresses/:id
router.delete(
  "/:id",
  requireAuth,
  deleteAddressController,
);

// PATCH /api/v1/addresses/:id/default
router.patch(
  "/:id/default",
  requireAuth,
  setDefaultAddressController,
);

export default router;