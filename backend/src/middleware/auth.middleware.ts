import type {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

import { authConfig } from "../config/auth.config.js";

export type AuthenticatedUser = {
  userId: string;
  roleId: string;
};

export type AuthenticatedRequest =
  Request & {
    user: AuthenticatedUser;
  };

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization =
      req.headers.authorization;

    if (
      typeof authorization !== "string"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "احراز هویت الزامی است.",
      });
    }

    if (
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "فرمت Authorization نامعتبر است.",
      });
    }

    const token =
      authorization
        .substring(7)
        .trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Access Token ارسال نشده است.",
      });
    }

    const decoded =
      jwt.verify(
        token,
        authConfig.accessToken.secret
      ) as {
        userId?: unknown;
        roleId?: unknown;
      };

    if (
      typeof decoded.userId !== "string" ||
      typeof decoded.roleId !== "string"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Access Token نامعتبر است.",
      });
    }

    (
      req as AuthenticatedRequest
    ).user = {
      userId: decoded.userId,
      roleId: decoded.roleId,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message:
        "Access Token نامعتبر یا منقضی شده است.",
    });
  }
}