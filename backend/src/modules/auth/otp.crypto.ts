import bcrypt from "bcrypt";

const OTP_SALT_ROUNDS = 10;

export async function hashOtp(
  otp: string
): Promise<string> {
  return bcrypt.hash(
    otp,
    OTP_SALT_ROUNDS
  );
}

export async function verifyOtp(
  otp: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(
    otp,
    hash
  );
}