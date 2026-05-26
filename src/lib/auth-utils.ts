const PLACEHOLDER_NAMES = new Set([
  "minaliya customer",
  "guest user",
  "user",
]);

/** True when the user has chosen a real display name (not a system placeholder). */
export function hasValidProfileName(name: string | null | undefined): boolean {
  if (!name || name.trim().length < 2) return false;
  return !PLACEHOLDER_NAMES.has(name.trim().toLowerCase());
}

export function normalizePhone(mobile: string): string {
  const digits = mobile.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** True when email + phone match configured admin credentials. */
export function isAdminCredentialsMatch(
  email: string,
  mobile: string,
  adminEmail: string,
  adminPhone: string
): boolean {
  return (
    normalizeEmail(email) === normalizeEmail(adminEmail) &&
    normalizePhone(mobile) === normalizePhone(adminPhone)
  );
}

/**
 * A returning user must have the same phone + email on file with a real name.
 * Phone-only or email-only partial matches still require the name step.
 */
export function isCompleteReturningUser(
  user: {
    name: string | null;
    email: string | null;
    phoneNumber: string | null;
  },
  email: string,
  mobile: string
): boolean {
  if (!hasValidProfileName(user.name)) return false;
  if (!user.phoneNumber || !user.email) return false;

  return (
    normalizePhone(user.phoneNumber) === normalizePhone(mobile) &&
    normalizeEmail(user.email) === normalizeEmail(email)
  );
}
