import {
  eq,
  sql,
  and,
  isNull,
  gt,
  desc,
} from "drizzle-orm";

import { db } from "../../database/index.js";
import { otpCodes } from "../../database/schema/otp.schema.js";

export async function createOtp(data: {
  phone: string;
  codeHash: string;
  expiresAt: Date;
}) {
  const [otp] = await db
    .insert(otpCodes)
    .values({
      phone: data.phone,
      codeHash: data.codeHash,
      expiresAt: data.expiresAt,
    })
    .returning();

  if (!otp) {
    throw new Error(
      "Failed to create OTP."
    );
  }

  return otp;
}

export async function findLatestOtpByPhone(
  phone: string
) {
  const [otp] = await db
    .select()
    .from(otpCodes)
    .where(eq(otpCodes.phone, phone))
    .orderBy(otpCodes.createdAt)
    .limit(1);

  return otp;
}
export async function findActiveOtpByPhone(
  phone: string
) {
  const [otp] = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.phone, phone),
        isNull(otpCodes.verifiedAt),
        gt(
          otpCodes.expiresAt,
          new Date()
        )
      )
    )
    .orderBy(
      desc(otpCodes.createdAt)
    )
    .limit(1);

  return otp;
}
export async function invalidatePreviousOtps(
  phone: string
) {
  await db
    .update(otpCodes)
    .set({
      expiresAt: new Date(),
    })
    .where(eq(otpCodes.phone, phone));
}
export async function findOtpById(
  id: string
) {
  const [otp] = await db
    .select()
    .from(otpCodes)
    .where(eq(otpCodes.id, id))
    .limit(1);

  return otp;
}

export async function incrementOtpAttempts(
  id: string
) {
  const [otp] = await db
    .update(otpCodes)
    .set({
      attempts: sql`${otpCodes.attempts} + 1`,
    })
    .where(eq(otpCodes.id, id))
    .returning();

  return otp;
}
export async function markOtpAsVerified(
  id: string
) {
  const [otp] = await db
    .update(otpCodes)
    .set({
      verifiedAt: new Date(),
    })
    .where(
      eq(
        otpCodes.id,
        id
      )
    )
    .returning();

  return otp;
}