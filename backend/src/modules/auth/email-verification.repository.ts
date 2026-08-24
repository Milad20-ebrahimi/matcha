import {
  and,
  desc,
  eq,
  gt,
  isNull,
  sql,
} from "drizzle-orm";

import { db } from "../../database/index.js";

import {
  emailVerificationCodes,
} from "../../database/schema/email-verification.schema.js";

export async function createEmailVerificationCode(
  data: {
    email: string;
    codeHash: string;
    expiresAt: Date;
  }
) {
  const [verification] = await db
    .insert(emailVerificationCodes)
    .values({
      email: data.email,
      codeHash: data.codeHash,
      expiresAt: data.expiresAt,
    })
    .returning();

  if (!verification) {
    throw new Error(
      "Failed to create email verification code."
    );
  }

  return verification;
}

export async function findActiveEmailVerificationCode(
  email: string
) {
  const [verification] = await db
    .select()
    .from(emailVerificationCodes)
    .where(
      and(
        eq(
          emailVerificationCodes.email,
          email
        ),
        isNull(
          emailVerificationCodes.verifiedAt
        ),
        gt(
          emailVerificationCodes.expiresAt,
          new Date()
        )
      )
    )
    .orderBy(
      desc(
        emailVerificationCodes.createdAt
      )
    )
    .limit(1);

  return verification;
}

export async function findEmailVerificationCodeById(
  id: string
) {
  const [verification] = await db
    .select()
    .from(emailVerificationCodes)
    .where(
      eq(
        emailVerificationCodes.id,
        id
      )
    )
    .limit(1);

  return verification;
}

export async function incrementEmailVerificationAttempts(
  id: string
) {
  const [verification] = await db
    .update(emailVerificationCodes)
    .set({
      attempts: sql`${emailVerificationCodes.attempts} + 1`,
    })
    .where(
      eq(
        emailVerificationCodes.id,
        id
      )
    )
    .returning();

  return verification;
}

export async function markEmailVerificationAsVerified(
  id: string
) {
  const [verification] = await db
    .update(emailVerificationCodes)
    .set({
      verifiedAt: new Date(),
    })
    .where(
      eq(
        emailVerificationCodes.id,
        id
      )
    )
    .returning();

  return verification;
}