import type {
  Request,
  Response,
} from "express";

import {
  getUserAddresses,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultUserAddress,
} from "./address.service.js";

function getUserId(
  req: Request
) {
  return (req as any).user?.userId;
}

/**
 * GET /users/me/addresses
 */
export async function getAddressesController(
  req: Request,
  res: Response
) {
  try {
    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message:
          "کاربر احراز هویت نشده است.",
      });
    }

    const addresses =
      await getUserAddresses(
        userId
      );

    return res.status(200).json({
      message:
        "آدرس‌های کاربر دریافت شد.",
      data: addresses,
    });
  } catch (error) {
    console.error(
      "Get addresses error:",
      error
    );

    return res.status(500).json({
      message:
        "خطا در دریافت آدرس‌ها.",
    });
  }
}

/**
 * POST /users/me/addresses
 */
export async function createAddressController(
  req: Request,
  res: Response
) {
  try {
    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message:
          "کاربر احراز هویت نشده است.",
      });
    }

    const address =
      await createUserAddress(
        userId,
        req.body
      );

    return res.status(201).json({
      message:
        "آدرس با موفقیت ایجاد شد.",
      data: address,
    });
  } catch (error) {
    console.error(
      "Create address error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "خطا در ایجاد آدرس.";

    return res.status(400).json({
      message,
    });
  }
}

/**
 * PATCH /users/me/addresses/:id
 */
export async function updateAddressController(
  req: Request,
  res: Response
) {
  try {
    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message:
          "کاربر احراز هویت نشده است.",
      });
    }

    const addressId =
      req.params.id;

    if (
      typeof addressId !==
      "string"
    ) {
      return res.status(400).json({
        message:
          "شناسه آدرس نامعتبر است.",
      });
    }

    const address =
      await updateUserAddress(
        userId,
        addressId,
        req.body
      );

    return res.status(200).json({
      message:
        "آدرس با موفقیت بروزرسانی شد.",
      data: address,
    });
  } catch (error) {
    console.error(
      "Update address error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "خطا در بروزرسانی آدرس.";

    return res.status(400).json({
      message,
    });
  }
}

/**
 * DELETE /users/me/addresses/:id
 */
export async function deleteAddressController(
  req: Request,
  res: Response
) {
  try {
    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message:
          "کاربر احراز هویت نشده است.",
      });
    }

    const addressId =
      req.params.id;

    if (
      typeof addressId !==
      "string"
    ) {
      return res.status(400).json({
        message:
          "شناسه آدرس نامعتبر است.",
      });
    }

    await deleteUserAddress(
      userId,
      addressId
    );

    return res.status(200).json({
      message:
        "آدرس با موفقیت حذف شد.",
    });
  } catch (error) {
    console.error(
      "Delete address error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "خطا در حذف آدرس.";

    return res.status(400).json({
      message,
    });
  }
}

/**
 * PATCH /users/me/addresses/:id/default
 */
export async function setDefaultAddressController(
  req: Request,
  res: Response
) {
  try {
    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message:
          "کاربر احراز هویت نشده است.",
      });
    }

    const addressId =
      req.params.id;

    if (
      typeof addressId !==
      "string"
    ) {
      return res.status(400).json({
        message:
          "شناسه آدرس نامعتبر است.",
      });
    }

    const address =
      await setDefaultUserAddress(
        userId,
        addressId
      );

    return res.status(200).json({
      message:
        "آدرس پیش‌فرض با موفقیت تغییر کرد.",
      data: address,
    });
  } catch (error) {
    console.error(
      "Set default address error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "خطا در تغییر آدرس پیش‌فرض.";

    return res.status(400).json({
      message,
    });
  }
}