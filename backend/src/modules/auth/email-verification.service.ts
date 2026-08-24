import {
  generateOtp,
} from "./otp.util.js";

import {
  hashOtp,
  verifyOtp as verifyOtpHash,
} from "./otp.crypto.js";

import {
  createEmailVerificationCode,
  findActiveEmailVerificationCode,
  findEmailVerificationCodeById,
  incrementEmailVerificationAttempts,
  markEmailVerificationAsVerified,
} from "./email-verification.repository.js";

import {
  findUserByEmail,
} from "../users/user.repository.js";

const EMAIL_VERIFICATION_EXPIRES_IN_MINUTES = 10;

export async function requestEmailVerification(
  email: string
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error(
      "ایمیل الزامی است."
    );
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalizedEmail
    )
  ) {
    throw new Error(
      "فرمت ایمیل صحیح نیست."
    );
  }

  const user =
    await findUserByEmail(
      normalizedEmail
    );

  if (!user) {
    throw new Error(
      "کاربری با این ایمیل پیدا نشد."
    );
  }

  if (user.emailVerified) {
    throw new Error(
      "این ایمیل قبلاً تأیید شده است."
    );
  }

  const latestCode =
    await findActiveEmailVerificationCode(
      normalizedEmail
    );

  if (latestCode) {
    const secondsSinceCreation =
      Math.floor(
        (
          Date.now() -
          latestCode.createdAt.getTime()
        ) / 1000
      );

    if (secondsSinceCreation < 60) {
      const secondsRemaining =
        60 - secondsSinceCreation;

      throw new Error(
        `لطفاً ${secondsRemaining} ثانیه دیگر دوباره تلاش کنید.`
      );
    }
  }

  const code =
    generateOtp();

  const codeHash =
    await hashOtp(code);

  const expiresAt =
    new Date(
      Date.now() +
        EMAIL_VERIFICATION_EXPIRES_IN_MINUTES *
          60 *
          1000
    );

  const verification =
    await createEmailVerificationCode({
      email:
        normalizedEmail,
      codeHash,
      expiresAt,
    });

  console.log(
    `[DEV EMAIL VERIFICATION] ${normalizedEmail}: ${code}`
  );

  return {
    verificationId:
      verification.id,

    email:
      normalizedEmail,

    expiresAt:
      verification.expiresAt,
  };
}

export async function verifyEmailVerification(
  verificationId: string,
  code: string
) {
  if (
    !/^\d{6}$/.test(code)
  ) {
    throw new Error(
      "کد تأیید باید ۶ رقم باشد."
    );
  }

  const verification =
    await findEmailVerificationCodeById(
      verificationId
    );

  if (!verification) {
    throw new Error(
      "کد تأیید پیدا نشد."
    );
  }

  if (verification.verifiedAt) {
    throw new Error(
      "این کد قبلاً استفاده شده است."
    );
  }

  if (
    verification.expiresAt <=
    new Date()
  ) {
    throw new Error(
      "کد تأیید منقضی شده است."
    );
  }

  if (
    verification.attempts >= 5
  ) {
    throw new Error(
      "تعداد تلاش‌های مجاز تمام شده است."
    );
  }

  const isValid =
    await verifyOtpHash(
      code,
      verification.codeHash
    );

  if (!isValid) {
    await incrementEmailVerificationAttempts(
      verification.id
    );

    throw new Error(
      "کد تأیید اشتباه است."
    );
  }

  await markEmailVerificationAsVerified(
    verification.id
  );

  return {
    success: true,

    email:
      verification.email,
  };
}