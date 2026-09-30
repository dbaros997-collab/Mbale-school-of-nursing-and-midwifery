import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 32;

/** Hash a portal password for storage in Supabase (server-side only). */
export function hashPortalPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, KEY_LEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export function verifyPortalPassword(password: string, passwordHash: string): boolean {
  if (!passwordHash.startsWith("scrypt:")) {
    return false;
  }
  const parts = passwordHash.split(":");
  if (parts.length !== 3) return false;
  const salt = Buffer.from(parts[1]!, "hex");
  const expected = Buffer.from(parts[2]!, "hex");
  if (expected.length !== KEY_LEN) return false;
  const derived = scryptSync(password, salt, KEY_LEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return timingSafeEqual(expected, derived);
}
