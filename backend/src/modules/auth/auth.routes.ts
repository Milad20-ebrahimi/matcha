import { Router } from "express";

import {
  requestOtpController,
  requestRegistrationOtpController,
  verifyOtpController,
  completeRegistrationController,
  refreshController,
  logoutController,
  registerWithEmailController,
  loginWithEmailController,
} from "./auth.controller.js";
import {
  requestEmailVerificationController,
  verifyEmailVerificationController,
} from "./email-verification.controller.js";
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
router.post(
  "/register-email",
  registerWithEmailController
);

router.post(
  "/login-email",
  loginWithEmailController
);
router.post(
  "/request-email-verification",
  requestEmailVerificationController
);

router.post(
  "/verify-email",
  verifyEmailVerificationController
);

export default router;