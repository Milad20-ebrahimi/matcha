import type {
  Request,
  Response,
} from "express";

import {
  findUserById,
} from "./user.repository.js";

import {
  updateUserProfileService,
} from "./user.service.js";

export async function getMeController(
  req: Request,
  res: Response
) {
  try {
    const userId =
      (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        message:
          "کاربر احراز هویت نشده است.",
      });
    }

    const user =
      await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        message:
          "کاربر پیدا نشد.",
      });
    }

    return res.status(200).json({
      message:
        "اطلاعات کاربر دریافت شد.",

      data: {
        id: user.id,
        roleId: user.roleId,
        firstName:
          user.firstName,
        lastName:
          user.lastName,
        email:
          user.email,
        phone:
          user.phone,
        phoneVerified:
          user.phoneVerified,
        emailVerified:
          user.emailVerified,
        isActive:
          user.isActive,
        lastLoginAt:
          user.lastLoginAt,
        createdAt:
          user.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Get me error:",
      error
    );

    return res.status(500).json({
      message:
        "خطا در دریافت اطلاعات کاربر.",
    });
  }
}

export async function updateMeController(
  req: Request,
  res: Response
) {
  try {
    const userId =
      (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        message:
          "کاربر احراز هویت نشده است.",
      });
    }

    const {
      firstName,
      lastName,
      email,
    } = req.body;

    if (
      firstName !== undefined &&
      typeof firstName !== "string"
    ) {
      return res.status(400).json({
        message:
          "نام باید به صورت متن باشد.",
      });
    }

    if (
      lastName !== undefined &&
      typeof lastName !== "string"
    ) {
      return res.status(400).json({
        message:
          "نام خانوادگی باید به صورت متن باشد.",
      });
    }

    if (
      email !== undefined &&
      typeof email !== "string"
    ) {
      return res.status(400).json({
        message:
          "ایمیل باید به صورت متن باشد.",
      });
    }

    const user =
      await updateUserProfileService(
        userId,
        {
          firstName,
          lastName,
          email,
        }
      );

    return res.status(200).json({
      message:
        "اطلاعات کاربر با موفقیت بروزرسانی شد.",

      data: {
        id: user.id,
        roleId: user.roleId,
        firstName:
          user.firstName,
        lastName:
          user.lastName,
        email:
          user.email,
        phone:
          user.phone,
        phoneVerified:
          user.phoneVerified,
        emailVerified:
          user.emailVerified,
        isActive:
          user.isActive,
        lastLoginAt:
          user.lastLoginAt,
        createdAt:
          user.createdAt,
        updatedAt:
          user.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Update me error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "خطا در بروزرسانی اطلاعات کاربر.";

    return res.status(400).json({
      message,
    });
  }
}