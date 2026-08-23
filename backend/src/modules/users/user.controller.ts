import type {
  Request,
  Response,
} from "express";

import {
  findUserById,
} from "./user.repository.js";

import {
  findUserProfileByUserId,
} from "./user-profile.repository.js";

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

    const profile =
      await findUserProfileByUserId(
        userId
      );

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

        updatedAt:
          user.updatedAt,

        profile: profile
          ? {
              id:
                profile.id,

              dateOfBirth:
                profile.dateOfBirth,

              job:
                profile.job,

              bio:
                profile.bio,

              avatarUrl:
                profile.avatarUrl,

              createdAt:
                profile.createdAt,

              updatedAt:
                profile.updatedAt,
            }
          : null,
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
      dateOfBirth,
      job,
      bio,
      avatarUrl,
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

    if (
      dateOfBirth !== undefined &&
      dateOfBirth !== null &&
      typeof dateOfBirth !== "string"
    ) {
      return res.status(400).json({
        message:
          "تاریخ تولد باید به صورت متن باشد.",
      });
    }

    if (
      job !== undefined &&
      job !== null &&
      typeof job !== "string"
    ) {
      return res.status(400).json({
        message:
          "شغل باید به صورت متن باشد.",
      });
    }

    if (
      bio !== undefined &&
      bio !== null &&
      typeof bio !== "string"
    ) {
      return res.status(400).json({
        message:
          "بیوگرافی باید به صورت متن باشد.",
      });
    }

    if (
      avatarUrl !== undefined &&
      avatarUrl !== null &&
      typeof avatarUrl !== "string"
    ) {
      return res.status(400).json({
        message:
          "آدرس تصویر باید به صورت متن باشد.",
      });
    }

    const result =
      await updateUserProfileService(
        userId,
        {
          firstName,
          lastName,
          email,

          dateOfBirth,
          job,
          bio,
          avatarUrl,
        }
      );

    return res.status(200).json({
      message:
        "اطلاعات کاربر با موفقیت بروزرسانی شد.",

      data: {
        id:
          result.user.id,

        roleId:
          result.user.roleId,

        firstName:
          result.user.firstName,

        lastName:
          result.user.lastName,

        email:
          result.user.email,

        phone:
          result.user.phone,

        phoneVerified:
          result.user.phoneVerified,

        emailVerified:
          result.user.emailVerified,

        isActive:
          result.user.isActive,

        lastLoginAt:
          result.user.lastLoginAt,

        createdAt:
          result.user.createdAt,

        updatedAt:
          result.user.updatedAt,

        profile: {
          id:
            result.profile.id,

          dateOfBirth:
            result.profile.dateOfBirth,

          job:
            result.profile.job,

          bio:
            result.profile.bio,

          avatarUrl:
            result.profile.avatarUrl,

          createdAt:
            result.profile.createdAt,

          updatedAt:
            result.profile.updatedAt,
        },
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