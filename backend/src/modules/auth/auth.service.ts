import {
  normalizeAndValidateIranPhone,
} from "../../utils/phone.js";

import {
  generateOtp,
} from "./otp.util.js";

import {
  hashOtp,
} from "./otp.crypto.js";

import {
  createOtp,
  findActiveOtpByPhone,
  findOtpById,
  incrementOtpAttempts,
  markOtpAsVerified,
} from "./auth.repository.js";
import {
  findUserByPhone,
} from "../users/user.repository.js";
import {
  verifyOtp as verifyOtpHash,
} from "./otp.crypto.js";
import {
  registerUser,
} from "../users/user.service.js";
import {
  createAuthSession,
} from "./auth.session.js";
const OTP_EXPIRES_IN_MINUTES = 2;

export async function requestOtp(
  phone: string
) {
  const normalizedPhone =
    normalizeAndValidateIranPhone(
      phone
    );
    const latestOtp =
  await findActiveOtpByPhone(
    normalizedPhone
  );

if (latestOtp) {
  const secondsSinceCreation = Math.floor(
    (Date.now() -
      latestOtp.createdAt.getTime()) /
      1000
  );

  if (secondsSinceCreation < 60) {
    const secondsRemaining =
      60 - secondsSinceCreation;

    throw new Error(
      `لطفاً ${secondsRemaining} ثانیه دیگر دوباره تلاش کنید.`
    );
  }
}
  const code = generateOtp();

  const codeHash =
    await hashOtp(code);

  const expiresAt = new Date(
    Date.now() +
      OTP_EXPIRES_IN_MINUTES *
        60 *
        1000
  );

  const otp = await createOtp({
    phone: normalizedPhone,
    codeHash,
    expiresAt,
  });

  /*
   * فعلاً SMS Provider نداریم.
   *
   * در محیط توسعه OTP را در Console
   * نمایش می‌دهیم.
   */
  console.log(
    `[DEV OTP] ${normalizedPhone}: ${code}`
  );

  return {
    otpId: otp.id,
    phone: normalizedPhone,
    expiresAt: otp.expiresAt,
  };
}
export async function verifyOtp(
  otpId: string,
  code: string
) {
  if (!/^\d{6}$/.test(code)) {
    throw new Error(
      "کد تأیید باید ۶ رقم باشد."
    );
  }

  const otp =
    await findOtpById(otpId);

  if (!otp) {
    throw new Error(
      "کد تأیید پیدا نشد."
    );
  }

  if (
    otp.verifiedAt
  ) {
    throw new Error(
      "این کد قبلاً استفاده شده است."
    );
  }

  if (
    otp.expiresAt <= new Date()
  ) {
    throw new Error(
      "کد تأیید منقضی شده است."
    );
  }

  if (otp.attempts >= 5) {
    throw new Error(
      "تعداد تلاش‌های مجاز تمام شده است."
    );
  }

  const isValid =
    await verifyOtpHash(
      code,
      otp.codeHash
    );

  if (!isValid) {
    await incrementOtpAttempts(
      otp.id
    );

    throw new Error(
      "کد تأیید اشتباه است."
    );
  }
await markOtpAsVerified(otp.id);

const user =
  await findUserByPhone(
    otp.phone
  );

if (!user) {
  return {
    success: true,
    phone: otp.phone,
    isNewUser: true,
    needsName: true,
  };
}

const session =
  await createAuthSession({
    userId: user.id,
    roleId: user.roleId,
  });

return {
  success: true,
  phone: otp.phone,
  isNewUser: false,
  needsName: false,
  userId: user.id,
  accessToken: session.accessToken,
  refreshToken: session.refreshToken,
};
}
export async function completeRegistration(
  otpId: string,
  firstName: string
) {
  const otp =
    await findOtpById(otpId);

  if (!otp) {
    throw new Error(
      "کد تأیید پیدا نشد."
    );
  }

  if (!otp.verifiedAt) {
    throw new Error(
      "شماره موبایل هنوز تأیید نشده است."
    );
  }

const result =
  await registerUser({
    phone: otp.phone,
    firstName,
  });

const session =
  await createAuthSession({
    userId: result.user.id,
    roleId: result.user.roleId,
  });

return {
  success: true,
  user: result.user,
  accessToken: session.accessToken,
  refreshToken: session.refreshToken,
};
}