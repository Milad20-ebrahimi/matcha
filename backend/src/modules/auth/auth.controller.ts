import type { Request, Response } from "express";

import {
  requestOtp,
  requestRegistrationOtp,
  verifyOtp,
  completeRegistration,
  registerWithEmail,
  loginWithEmail,
} from "./auth.service.js";
import {
  refreshAuthSession,
} from "./auth.refresh.js";
import {
  logout,
} from "./auth.logout.js";
export async function requestOtpController(
  req: Request,
  res: Response
) {
  try {
    const { phone } = req.body;

    if (
      typeof phone !== "string" ||
      !phone.trim()
    ) {
      return res.status(400).json({
        message:
          "شماره موبایل الزامی است.",
      });
    }

    const result =
      await requestOtp(phone);

    return res.status(200).json({
      message:
        "کد تأیید ارسال شد.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Request OTP error:",
      error
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "خطا در درخواست کد تأیید.",
    });
  }
}
export async function verifyOtpController(
  req: Request,
  res: Response
) {
  try {
    const { otpId, code } = req.body;

    if (
      typeof otpId !== "string" ||
      !otpId.trim()
    ) {
      return res.status(400).json({
        message:
          "شناسه کد تأیید الزامی است.",
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
      await verifyOtp(
        otpId,
        code
      );

    return res.status(200).json({
      message:
        "کد تأیید با موفقیت تأیید شد.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Verify OTP error:",
      error
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "خطا در تأیید کد.",
    });
  }
}
export async function completeRegistrationController(
  req: Request,
  res: Response
) {
  try {
    const { otpId, firstName } = req.body;

    if (
      typeof otpId !== "string" ||
      !otpId.trim()
    ) {
      return res.status(400).json({
        message:
          "شناسه تأیید الزامی است.",
      });
    }

    if (
      typeof firstName !== "string" ||
      !firstName.trim()
    ) {
      return res.status(400).json({
        message:
          "نام الزامی است.",
      });
    }

    const result =
      await completeRegistration(
        otpId,
        firstName
      );

    return res.status(201).json({
      message:
        "ثبت‌نام با موفقیت انجام شد.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Complete registration error:",
      error
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "خطا در ثبت‌نام.",
    });
  }
}
export async function refreshController(
  req: Request,
  res: Response
) {
  try {
    const {
      refreshToken,
    } = req.body;

    if (
      typeof refreshToken !== "string" ||
      !refreshToken.trim()
    ) {
      return res.status(400).json({
        message:
          "Refresh Token الزامی است.",
      });
    }

    const result =
      await refreshAuthSession(
        refreshToken
      );

    return res.status(200).json({
      message:
        "توکن با موفقیت تمدید شد.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Refresh token error:",
      error
    );

    return res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "Refresh Token نامعتبر است.",
    });
  }
}
export async function logoutController(
  req: Request,
  res: Response
) {
  try {
    const {
      refreshToken,
    } = req.body;

    if (
      typeof refreshToken !== "string" ||
      !refreshToken.trim()
    ) {
      return res.status(400).json({
        message:
          "Refresh Token الزامی است.",
      });
    }

    await logout(refreshToken);

    return res.status(200).json({
      message:
        "با موفقیت از حساب خارج شدید.",
    });
  } catch (error) {
    console.error(
      "Logout error:",
      error
    );

    return res.status(500).json({
      message:
        "خطا در خروج از حساب.",
    });
  }
}
export async function requestRegistrationOtpController(
  req: Request,
  res: Response
) {
  try {
    const { phone } = req.body;

    if (
      typeof phone !== "string" ||
      !phone.trim()
    ) {
      return res.status(400).json({
        message:
          "شماره موبایل الزامی است.",
      });
    }

    const result =
      await requestRegistrationOtp(
        phone
      );

    return res.status(200).json({
      message:
        "کد تأیید ارسال شد.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Request registration OTP error:",
      error
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "خطا در درخواست کد ثبت‌نام.",
    });
  }
}
export async function registerWithEmailController(
  req: Request,
  res: Response
) {
  try {
    const {
      email,
      password,
      firstName,
    } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        message:
          "ایمیل الزامی است.",
      });
    }

    if (
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message:
          "رمز عبور الزامی است.",
      });
    }

    if (
      typeof firstName !== "string" ||
      !firstName.trim()
    ) {
      return res.status(400).json({
        message:
          "نام الزامی است.",
      });
    }

    const result =
      await registerWithEmail(
        email,
        password,
        firstName
      );

    return res.status(201).json({
      message:
        "ثبت‌نام با موفقیت انجام شد.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Email registration error:",
      error
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "خطا در ثبت‌نام.",
    });
  }
}


export async function loginWithEmailController(
  req: Request,
  res: Response
) {
  try {
    const {
      email,
      password,
    } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        message:
          "ایمیل الزامی است.",
      });
    }

    if (
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message:
          "رمز عبور الزامی است.",
      });
    }

    const result =
      await loginWithEmail(
        email,
        password
      );

    return res.status(200).json({
      message:
        "ورود با موفقیت انجام شد.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Email login error:",
      error
    );

    return res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "ایمیل یا رمز عبور اشتباه است.",
    });
  }
}