import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { authConfig } from "../../config/auth.config.js";

type AccessTokenPayload = {
  userId: string;
  roleId: string;
};

export function generateAccessToken(
  payload: AccessTokenPayload
) {
  return jwt.sign(
    {
      userId: payload.userId,
      roleId: payload.roleId,
    },
    authConfig.accessToken.secret,
    {
      expiresIn: "15m",
    }
  );
}
export function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(
  token: string
) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}