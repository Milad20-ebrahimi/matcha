import type {
  Request,
  Response,
} from "express";

import {
  createUserOrder,
} from "./order.service.js";

function getUserId(
  req: Request,
): string | undefined {
  return (req as any).user?.userId;
}

/**
 * POST /orders
 *
 * ایجاد سفارش از روی سبد خرید کاربر
 */
export async function createOrderController(
  req: Request,
  res: Response,
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

    const {
      shippingAddress,
      paymentMethod,
    } = req.body ?? {};

    if (
      typeof shippingAddress !==
        "string" ||
      !shippingAddress.trim()
    ) {
      return res.status(400).json({
        message:
          "آدرس ارسال الزامی است.",
      });
    }

    if (
      paymentMethod !== "ONLINE" &&
      paymentMethod !== "CASH"
    ) {
      return res.status(400).json({
        message:
          "روش پرداخت نامعتبر است.",
      });
    }

    const result =
      await createUserOrder(
        userId,
        {
          shippingAddress,
          paymentMethod,
        },
      );

    return res.status(201).json({
      message:
        "سفارش با موفقیت ایجاد شد.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "خطا در ایجاد سفارش.";

    return res.status(400).json({
      message,
    });
  }
}