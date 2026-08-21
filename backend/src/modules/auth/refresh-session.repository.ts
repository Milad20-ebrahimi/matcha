import { eq } from "drizzle-orm";

import { db } from "../../database/index.js";
import { refreshSessions } from "../../database/schema/refresh-session.schema.js";

export async function createRefreshSession(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  const [session] = await db
    .insert(refreshSessions)
    .values({
      userId: data.userId,
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
    })
    .returning();

  if (!session) {
    throw new Error(
      "Failed to create refresh session."
    );
  }

  return session;
}

export async function findRefreshSessionByTokenHash(
  tokenHash: string
) {
  const [session] = await db
    .select()
    .from(refreshSessions)
    .where(
      eq(
        refreshSessions.tokenHash,
        tokenHash
      )
    )
    .limit(1);

  return session;
}
export async function revokeRefreshSessionByTokenHash(
  tokenHash: string
) {
  const [session] = await db
    .update(refreshSessions)
    .set({
      revokedAt: new Date(),
    })
    .where(
      eq(
        refreshSessions.tokenHash,
        tokenHash
      )
    )
    .returning();

  return session;
}
export async function revokeRefreshSession(
  sessionId: string
) {
  const [session] = await db
    .update(refreshSessions)
    .set({
      revokedAt: new Date(),
    })
    .where(
      eq(
        refreshSessions.id,
        sessionId
      )
    )
    .returning();

  return session;
}