import jwt from "jsonwebtoken";

import { authConfig } from "../config/auth.config.js";

export type AuthenticatedRequest = {
  userId: string;
  roleId: string;
};

export function requireAuth(
  req: any,
  res: any,
  next: any
) {
  try {
    const authorization =
      req.headers.authorization;

    if (
      typeof authorization !== "string"
    ) {
      return res.status(401).json({
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
        message:
          "فرمت Authorization نامعتبر است.",
      });
    }

    const token =
      authorization.substring(7);

    const decoded =
      jwt.verify(
        token,
        authConfig.accessToken.secret
      ) as {
        userId: string;
        roleId: string;
      };

    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId,
    };

    next();
  } catch {
    return res.status(401).json({
      message:
        "Access Token نامعتبر یا منقضی شده است.",
    });
  }
}