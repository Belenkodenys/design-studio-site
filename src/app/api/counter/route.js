import { NextResponse } from "next/server";
import Redis from "ioredis";

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

export async function GET(request) {
  try {
    const r = getRedis();
    if (!r) return NextResponse.json({ count: 0 });

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    const key = "visitors:unique";
    await r.sadd(key, ip);
    const count = await r.scard(key);

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
