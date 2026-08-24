import {
  normalizeAndValidateIranPhone,
} from "../../utils/phone.js";
import bcrypt from "bcrypt";
import {
  generateOtp,
} from "./otp.util.js";

import {
  hashOtp,
  verifyOtp as verifyOtpHash,
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
  findUserByEmail,
  findDefaultUserRole,
  createEmailUser,
} from "../users/user.repository.js";
import {
  createUserProfile,
} from "../users/user-profile.repository.js";
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
    const secondsSinceCreation =
      Math.floor(
        (
          Date.now() -
          latestOtp.createdAt.getTime()
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
      OTP_EXPIRES_IN_MINUTES *
      60 *
      1000
    );

  const otp =
    await createOtp({
      phone: normalizedPhone,
      codeHash,
      expiresAt,
    });

  /*
   * فعلاً SMS Provider نداریم.
   * در محیط توسعه OTP داخل Console نمایش داده می‌شود.
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
    await findOtpById(
      otpId
    );

  if (!otp) {
    throw new Error(
      "کد تأیید پیدا نشد."
    );
  }

  if (otp.verifiedAt) {
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

  if (
    otp.attempts >= 5
  ) {
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

  await markOtpAsVerified(
    otp.id
  );

  const user =
    await findUserByPhone(
      otp.phone
    );

  /*
   * کاربر جدید:
   * فعلاً Session ساخته نمی‌شود.
   * ابتدا باید complete-registration انجام شود.
   */
  if (!user) {
    return {
      success: true,
      phone: otp.phone,
      isNewUser: true,
      needsName: true,
    };
  }

  /*
   * کاربر موجود:
   * مستقیماً Session ساخته می‌شود.
   */
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
    accessToken:
      session.accessToken,
    refreshToken:
      session.refreshToken,
  };
}

export async function completeRegistration(
  otpId: string,
  firstName: string
) {
  const normalizedFirstName =
    firstName.trim();

  if (!normalizedFirstName) {
    throw new Error(
      "نام کاربر الزامی است."
    );
  }

  const otp =
    await findOtpById(
      otpId
    );

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

  /*
   * بررسی می‌کنیم که برای این شماره
   * کاربری از قبل ساخته نشده باشد.
   */
  const existingUser =
    await findUserByPhone(
      otp.phone
    );

  if (existingUser) {
    throw new Error(
      "این شماره موبایل قبلاً ثبت‌نام کرده است."
    );
  }

  const result =
    await registerUser({
      phone: otp.phone,
      firstName:
        normalizedFirstName,
    });

  /*
   * بعد از ساخت کاربر،
   * Session ایجاد می‌کنیم.
   */
  const session =
    await createAuthSession({
      userId:
        result.user.id,
      roleId:
        result.user.roleId,
    });

  return {
    success: true,

    user: result.user,

    profile:
      result.profile,

    accessToken:
      session.accessToken,

    refreshToken:
      session.refreshToken,
  };
}
export async function requestRegistrationOtp(
  phone: string
) {
  const normalizedPhone =
    normalizeAndValidateIranPhone(phone);

  const existingUser =
    await findUserByPhone(normalizedPhone);

  if (existingUser) {
    throw new Error(
      "این شماره موبایل قبلاً ثبت‌نام کرده است. لطفاً از صفحه ورود وارد شوید."
    );
  }

  const latestOtp =
    await findActiveOtpByPhone(
      normalizedPhone
    );

  if (latestOtp) {
    const secondsSinceCreation =
      Math.floor(
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

  const code =
    generateOtp();

  const codeHash =
    await hashOtp(code);

  const expiresAt =
    new Date(
      Date.now() +
        OTP_EXPIRES_IN_MINUTES *
          60 *
          1000
    );

  const otp =
    await createOtp({
      phone: normalizedPhone,
      codeHash,
      expiresAt,
    });

  console.log(
    `[DEV REGISTER OTP] ${normalizedPhone}: ${code}`
  );

  return {
    otpId: otp.id,
    phone: normalizedPhone,
    expiresAt: otp.expiresAt,
  };
}
export async function registerWithEmail(
  email: string,
  password: string,
  firstName: string
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const normalizedFirstName =
    firstName.trim();

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

  if (!normalizedFirstName) {
    throw new Error(
      "نام کاربر الزامی است."
    );
  }

  if (password.length < 8) {
    throw new Error(
      "رمز عبور باید حداقل ۸ کاراکتر باشد."
    );
  }

  const existingUser =
    await findUserByEmail(
      normalizedEmail
    );

  if (existingUser) {
    throw new Error(
      "این ایمیل قبلاً ثبت‌نام کرده است."
    );
  }

  const role =
    await findDefaultUserRole();

  const passwordHash =
    await bcrypt.hash(
      password,
      12
    );

  const user =
  await createEmailUser({
    roleId: role.id,
    email: normalizedEmail,
    firstName:
      normalizedFirstName,
    passwordHash,
  });

const profile =
  await createUserProfile(
    user.id
  );

const session =
  await createAuthSession({
      userId: user.id,
      roleId: user.roleId,
    });

  /*
   * passwordHash نباید به Frontend ارسال شود.
   */
  const {
    passwordHash: _passwordHash,
    ...safeUser
  } = user;

return {
  success: true,
  user,
  profile,
  accessToken:
    session.accessToken,
  refreshToken:
    session.refreshToken,
};
}

export async function loginWithEmail(
  email: string,
  password: string
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error(
      "ایمیل الزامی است."
    );
  }

  if (!password) {
    throw new Error(
      "رمز عبور الزامی است."
    );
  }

  const user =
    await findUserByEmail(
      normalizedEmail
    );

  if (!user) {
    throw new Error(
      "ایمیل یا رمز عبور اشتباه است."
    );
  }

  if (!user.passwordHash) {
    throw new Error(
      "این حساب با ایمیل و رمز عبور ثبت نشده است."
    );
  }

  if (!user.isActive) {
    throw new Error(
      "حساب کاربری شما غیرفعال است."
    );
  }

  const passwordValid =
    await bcrypt.compare(
      password,
      user.passwordHash
    );

  if (!passwordValid) {
    throw new Error(
      "ایمیل یا رمز عبور اشتباه است."
    );
  }

  const session =
    await createAuthSession({
      userId: user.id,
      roleId: user.roleId,
    });

  /*
   * passwordHash فقط برای بررسی رمز
   * در Backend استفاده می‌شود و نباید
   * در Response قرار بگیرد.
   */
  const {
    passwordHash: _passwordHash,
    ...safeUser
  } = user;

  return {
    success: true,
    user: safeUser,
    accessToken:
      session.accessToken,
    refreshToken:
      session.refreshToken,
  };
}