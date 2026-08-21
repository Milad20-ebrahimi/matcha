import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "./auth.tokens.js";

import {
  createRefreshSession,
  findRefreshSessionByTokenHash,
  revokeRefreshSession,
} from "./refresh-session.repository.js";

import { findUserById } from "../users/user.repository.js";

export async function refreshAuthSession(
  refreshToken: string
) {
  if (!refreshToken.trim()) {
    throw new Error(
      "Refresh Token الزامی است."
    );
  }

  const tokenHash =
    hashRefreshToken(refreshToken);

  const session =
    await findRefreshSessionByTokenHash(
      tokenHash
    );

  if (!session) {
    throw new Error(
      "Refresh Token نامعتبر است."
    );
  }

  if (session.revokedAt) {
    throw new Error(
      "Refresh Session باطل شده است."
    );
  }

  if (
    session.expiresAt.getTime() <=
    Date.now()
  ) {
    throw new Error(
      "Refresh Token منقضی شده است."
    );
  }

  const user =
    await findUserById(
      session.userId
    );

  if (!user) {
    throw new Error(
      "کاربر پیدا نشد."
    );
  }

  if (!user.isActive) {
    throw new Error(
      "حساب کاربر غیرفعال است."
    );
  }

  await revokeRefreshSession(
    session.id
  );

  const accessToken =
    generateAccessToken({
      userId: user.id,
      roleId: user.roleId,
    });

  const newRefreshToken =
    generateRefreshToken();

  const newTokenHash =
    hashRefreshToken(
      newRefreshToken
    );

  const newExpiresAt = new Date(
    Date.now() +
      30 * 24 * 60 * 60 * 1000
  );

  const newSession =
    await createRefreshSession({
      userId: user.id,
      tokenHash: newTokenHash,
      expiresAt: newExpiresAt,
    });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    refreshSessionId: newSession.id,
  };
}