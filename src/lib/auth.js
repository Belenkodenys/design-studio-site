import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const SECRET = process.env.ADMIN_PASSWORD || "belenko2024";

function makeToken() {
  const ts = Date.now().toString();
  const hmac = crypto.createHmac("sha256", SECRET).update(ts).digest("hex");
  return `${ts}.${hmac}`;
}

function validateToken(token) {
  const [ts, hmac] = token.split(".");
  if (!ts || !hmac) return false;
  const expected = crypto.createHmac("sha256", SECRET).update(ts).digest("hex");
  if (hmac !== expected) return false;
  return Date.now() - parseInt(ts, 10) < 24 * 60 * 60 * 1000;
}

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return validateToken(token);
}

export async function createSession() {
  return makeToken();
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
