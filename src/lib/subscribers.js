// Newsletter subscribers for the residential page.
// Stored in Redis as one hash: field = lower-cased email, value = JSON record.
import Redis from "ioredis";
import crypto from "crypto";

const KEY = "newsletter:residential:subscribers";

let redis = null;
function getRedis() {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  redis = new Redis(url, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    connectTimeout: 3000,
    commandTimeout: 3000,
  });
  return redis;
}

export function isValidEmail(email) {
  return typeof email === "string" && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// Allow at most `max` attempts per hour from one address (the address is hashed).
export async function underRateLimit(ip, max = 8) {
  const r = getRedis();
  if (!r) return true;
  const id = crypto.createHash("sha256").update("newsletter:" + ip).digest("hex").slice(0, 32);
  const key = "newsletter:rl:" + id;
  const n = await r.incr(key);
  if (n === 1) await r.expire(key, 3600);
  return n <= max;
}

// Returns { ok, already } — `already` is true when the email was subscribed before.
export async function addSubscriber(email, source = "residential") {
  const r = getRedis();
  if (!r) throw new Error("Redis not configured");
  const id = email.trim().toLowerCase();
  const existing = await r.hget(KEY, id);
  if (existing) return { ok: true, already: true };
  const record = {
    email: id,
    subscribedAt: new Date().toISOString(),
    source,
    token: crypto.randomBytes(18).toString("hex"),
  };
  await r.hset(KEY, id, JSON.stringify(record));
  return { ok: true, already: false };
}

export async function listSubscribers() {
  const r = getRedis();
  if (!r) return [];
  const all = await r.hgetall(KEY);
  return Object.values(all || {})
    .map((v) => { try { return JSON.parse(v); } catch { return null; } })
    .filter(Boolean)
    .sort((a, b) => (a.subscribedAt < b.subscribedAt ? -1 : 1));
}

export async function removeByToken(token) {
  const r = getRedis();
  if (!r || !token) return false;
  const all = await r.hgetall(KEY);
  for (const [id, v] of Object.entries(all || {})) {
    try {
      if (JSON.parse(v).token === token) { await r.hdel(KEY, id); return true; }
    } catch {}
  }
  return false;
}
