import {
  hashRefreshToken,
} from "./auth.tokens.js";

import {
  findRefreshSessionByTokenHash,
  revokeRefreshSession,
} from "./refresh-session.repository.js";

export async function logout(
  refreshToken: string
) {
  if (!refreshToken.trim()) {
    throw new Error(
      "Refresh Token الزامی است."
    );
  }

  const tokenHash =
    hashRefreshToken(
      refreshToken
    );

  const session =
    await findRefreshSessionByTokenHash(
      tokenHash
    );

  if (!session) {
    return;
  }

  if (session.revokedAt) {
    return;
  }

  await revokeRefreshSession(
    session.id
  );
}