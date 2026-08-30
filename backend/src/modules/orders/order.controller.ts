import type {
  Request,
  Response,
} from "express";

import {
  createUserOrder,
  getUserOrderById,
  getUserOrders,
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
    const userId = getUserId(req);

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
      typeof shippingAddress !== "string" ||
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

/**
 * GET /orders
 *
 * دریافت سفارش‌های کاربر
 */
export async function getOrdersController(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message:
          "کاربر احراز هویت نشده است.",
      });
    }

    const orders =
      await getUserOrders(userId);

    return res.status(200).json({
      message:
        "سفارش‌ها با موفقیت دریافت شدند.",
      data: orders,
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error,
    );

    return res.status(500).json({
      message:
        "خطا در دریافت سفارش‌ها.",
    });
  }
}

/**
 * GET /orders/:orderId
 *
 * دریافت جزئیات یک سفارش
 */
export async function getOrderController(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message:
          "کاربر احراز هویت نشده است.",
      });
    }

    const orderIdParam =
      req.params.orderId;

    if (
      typeof orderIdParam !== "string" ||
      !orderIdParam.trim()
    ) {
      return res.status(400).json({
        message:
          "شناسه سفارش نامعتبر است.",
      });
    }

    const orderId =
      orderIdParam.trim();

    const order =
      await getUserOrderById(
        orderId,
        userId,
      );

    if (!order) {
      return res.status(404).json({
        message:
          "سفارش پیدا نشد.",
      });
    }

    return res.status(200).json({
      message:
        "جزئیات سفارش با موفقیت دریافت شد.",
      data: order,
    });
  } catch (error) {
    console.error(
      "Get order details error:",
      error,
    );

    return res.status(500).json({
      message:
        "خطا در دریافت جزئیات سفارش.",
    });
  }
}