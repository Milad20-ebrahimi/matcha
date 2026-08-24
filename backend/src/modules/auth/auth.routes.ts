import { Router } from "express";

import {
  requestOtpController,
  requestRegistrationOtpController,
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
  "/request-registration-otp",
  requestRegistrationOtpController
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