import type {
  Request,
  Response,
} from "express";

import {
  getUserPayment,
  getPaymentByOrderId,
  changePaymentStatus,
} from "./payment.service.js";

function getUserId(
  req: Request,
): string | undefined {
  const userId = (req as any).user?.userId;

  return typeof userId === "string"
    ? userId
    : undefined;
}

function getParam(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  return undefined;
}

/**
 * GET /payments/:id
 *
 * دریافت یک پرداخت متعلق به کاربر
 */
export async function getPaymentController(
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

    const paymentId = getParam(
      req.params.id,
    );

    if (!paymentId) {
      return res.status(400).json({
        message:
          "شناسه پرداخت الزامی است.",
      });
    }

    const result =
      await getUserPayment(
        paymentId,
        userId,
      );

    return res.status(200).json({
      message:
        "اطلاعات پرداخت با موفقیت دریافت شد.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Get payment error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "خطا در دریافت پرداخت.";

    return res.status(404).json({
      message,
    });
  }
}

/**
 * GET /payments/order/:orderId
 *
 * دریافت پرداخت مربوط به یک سفارش
 */
export async function getPaymentByOrderController(
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

    const orderId = getParam(
      req.params.orderId,
    );

    if (!orderId) {
      return res.status(400).json({
        message:
          "شناسه سفارش الزامی است.",
      });
    }

    const payment =
      await getPaymentByOrderId(
        orderId,
      );

    const userPayment =
      await getUserPayment(
        payment.id,
        userId,
      );

    return res.status(200).json({
      message:
        "اطلاعات پرداخت با موفقیت دریافت شد.",
      data: userPayment,
    });
  } catch (error) {
    console.error(
      "Get order payment error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "خطا در دریافت پرداخت سفارش.";

    return res.status(404).json({
      message,
    });
  }
}

/**
 * PATCH /payments/:id/status
 *
 * تغییر وضعیت پرداخت
 */
export async function updatePaymentStatusController(
  req: Request,
  res: Response,
) {
  try {
    const paymentId = getParam(
      req.params.id,
    );

    if (!paymentId) {
      return res.status(400).json({
        message:
          "شناسه پرداخت الزامی است.",
      });
    }

    const {
      status,
      authority,
      refId,
    } = req.body ?? {};

    if (!status) {
      return res.status(400).json({
        message:
          "وضعیت پرداخت الزامی است.",
      });
    }

    const validStatuses = [
      "PENDING",
      "PAID",
      "FAILED",
      "REFUNDED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "وضعیت پرداخت نامعتبر است.",
      });
    }

    const result =
      await changePaymentStatus(
        paymentId,
        {
          status,
          authority,
          refId,
        },
      );

    return res.status(200).json({
      message:
        "وضعیت پرداخت با موفقیت تغییر کرد.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Update payment status error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "خطا در تغییر وضعیت پرداخت.";

    return res.status(400).json({
      message,
    });
  }
}