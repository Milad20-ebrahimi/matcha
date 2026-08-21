import { Router } from "express";

import {
  requestOtpController,
  verifyOtpController,
  completeRegistrationController,
  refreshController,
  logoutController,
} from "./auth.controller.js";

const router = Router();

router.post(
  "/request-otp",
  requestOtpController
);
router.post(
  "/verify-otp",
  verifyOtpController
);
router.post(
  "/complete-registration",
  completeRegistrationController
);
router.post(
  "/refresh",
  refreshController
);
router.post(
  "/logout",
  logoutController
);
export default router;