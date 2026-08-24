import type {
  Request,
  Response,
} from "express";

import {
  requestEmailVerification,
  verifyEmailVerification,
} from "./email-verification.service.js";

export async function requestEmailVerificationController(
  req: Request,
  res: Response
) {
  try {
    const { email } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        message:
          "ایمیل الزامی است.",
      });
    }

    const result =
      await requestEmailVerification(
        email
      );

    return res.status(200).json({
      message:
        "کد تأیید ایمیل ارسال شد.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Request email verification error:",
      error
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "خطا در ارسال کد تأیید ایمیل.",
    });
  }
}

export async function verifyEmailVerificationController(
  req: Request,
  res: Response
) {
  try {
    const {
      verificationId,
      code,
    } = req.body;

    if (
      typeof verificationId !== "string" ||
      !verificationId.trim()
    ) {
      return res.status(400).json({
        message:
          "شناسه تأیید الزامی است.",
      });
    }

    if (
      typeof code !== "string" ||
      !code.trim()
    ) {
      return res.status(400).json({
        message:
          "کد تأیید الزامی است.",
      });
    }

    const result =
      await verifyEmailVerification(
        verificationId,
        code
      );

    return res.status(200).json({
      message:
        "ایمیل با موفقیت تأیید شد.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Verify email verification error:",
      error
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "خطا در تأیید ایمیل.",
    });
  }
}