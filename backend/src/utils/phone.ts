const IRAN_MOBILE_REGEX = /^09\d{9}$/;

export function normalizeIranPhone(
  phone: string
): string {
  const normalized = phone
    .trim()
    .replace(/[\s()-]/g, "");

  if (normalized.startsWith("+98")) {
    return `0${normalized.slice(3)}`;
  }

  if (normalized.startsWith("98")) {
    return `0${normalized.slice(2)}`;
  }

  return normalized;
}

export function isValidIranPhone(
  phone: string
): boolean {
  const normalized =
    normalizeIranPhone(phone);

  return IRAN_MOBILE_REGEX.test(normalized);
}

export function normalizeAndValidateIranPhone(
  phone: string
): string {
  const normalized =
    normalizeIranPhone(phone);

  if (!IRAN_MOBILE_REGEX.test(normalized)) {
    throw new Error(
      "شماره موبایل ایران معتبر نیست."
    );
  }

  return normalized;
}