import {
  Router,
} from "express";

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

const router =
  Router();

router.get(
  "/",
  requireAuth,
  getAddressesController
);

router.post(
  "/",
  requireAuth,
  createAddressController
);

router.patch(
  "/:id",
  requireAuth,
  updateAddressController
);

router.delete(
  "/:id",
  requireAuth,
  deleteAddressController
);

router.patch(
  "/:id/default",
  requireAuth,
  setDefaultAddressController
);

export default router;