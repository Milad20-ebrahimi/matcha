import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "./auth.tokens.js";

import {
  createRefreshSession,
} from "./refresh-session.repository.js";

type CreateSessionInput = {
  userId: string;
  roleId: string;
};

export async function createAuthSession(
  data: CreateSessionInput
) {
  const accessToken =
    generateAccessToken({
      userId: data.userId,
      roleId: data.roleId,
    });

  const refreshToken =
    generateRefreshToken();

  const tokenHash =
    hashRefreshToken(
      refreshToken
    );

  const expiresAt = new Date(
    Date.now() +
      30 * 24 * 60 * 60 * 1000
  );

  const session =
    await createRefreshSession({
      userId: data.userId,
      tokenHash,
      expiresAt,
    });

  return {
    accessToken,
    refreshToken,
    refreshSessionId: session.id,
  };
}