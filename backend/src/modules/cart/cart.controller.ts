import type {
  Request,
  Response,
} from "express";

import type {
  AuthenticatedRequest,
} from "../../middleware/auth.middleware.js";

import {
  addItemToCart,
  clearUserCart,
  getUserCart,
  removeItemFromCart,
  updateCartItem,
} from "./cart.service.js";

export async function getCartController(
  req: Request,
  res: Response,
) {
  try {
    const user =
      (req as AuthenticatedRequest).user;

    const cart =
      await getUserCart(
        user.userId,
      );

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error(
      "Get cart error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "خطا در دریافت سبد خرید.",
    });
  }
}

export async function addCartItemController(
  req: Request,
  res: Response,
) {
  try {
    const user =
      (req as AuthenticatedRequest).user;

    const {
      productId,
      quantity,
    } = req.body;

    if (
      typeof productId !== "string" ||
      !productId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "شناسه محصول الزامی است.",
      });
    }

    if (
      quantity === undefined ||
      !Number.isInteger(quantity)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "تعداد محصول باید یک عدد صحیح باشد.",
      });
    }

    const item =
      await addItemToCart(
        user.userId,
        productId,
        quantity,
      );

    return res.status(201).json({
      success: true,
      message:
        "محصول به سبد خرید اضافه شد.",
      data: item,
    });
  } catch (error) {
    console.error(
      "Add cart item error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "افزودن محصول به سبد خرید ناموفق بود.",
    });
  }
}

export async function updateCartItemController(
  req: Request,
  res: Response,
) {
  try {
    const user =
      (req as AuthenticatedRequest).user;

    const productId =
      req.params.productId;

    const {
      quantity,
    } = req.body;

    if (
      typeof productId !== "string" ||
      !productId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "شناسه محصول الزامی است.",
      });
    }

    if (
      quantity === undefined ||
      !Number.isInteger(quantity)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "تعداد محصول باید یک عدد صحیح باشد.",
      });
    }

    const item =
      await updateCartItem(
        user.userId,
        productId,
        quantity,
      );

    return res.status(200).json({
      success: true,
      message:
        "تعداد محصول به‌روزرسانی شد.",
      data: item,
    });
  } catch (error) {
    console.error(
      "Update cart item error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "به‌روزرسانی سبد خرید ناموفق بود.",
    });
  }
}

export async function removeCartItemController(
  req: Request,
  res: Response,
) {
  try {
    const user =
      (req as AuthenticatedRequest).user;

    const productId =
      req.params.productId;

    if (
      typeof productId !== "string" ||
      !productId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "شناسه محصول الزامی است.",
      });
    }

    await removeItemFromCart(
      user.userId,
      productId,
    );

    return res.status(200).json({
      success: true,
      message:
        "محصول از سبد خرید حذف شد.",
    });
  } catch (error) {
    console.error(
      "Remove cart item error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "حذف محصول از سبد خرید ناموفق بود.",
    });
  }
}

export async function clearCartController(
  req: Request,
  res: Response,
) {
  try {
    const user =
      (req as AuthenticatedRequest).user;

    await clearUserCart(
      user.userId,
    );

    return res.status(200).json({
      success: true,
      message:
        "سبد خرید خالی شد.",
    });
  } catch (error) {
    console.error(
      "Clear cart error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "خالی کردن سبد خرید ناموفق بود.",
    });
  }
}