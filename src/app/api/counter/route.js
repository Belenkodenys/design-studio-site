import { NextResponse } from "next/server";
import Redis from "ioredis";
import { createHash } from "crypto";
import { recordVisit } from "@/lib/geo";

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

    // ?page=residential keeps a separate set for the hidden /residential page;
    // its members are hashed so no raw IP addresses are stored for it.
    const params = new URL(request.url).searchParams;
    const page = params.get("page");
    // Geography of visits (admin -> География): country / city per page, no addresses stored.
    try { await recordVisit(r, request, params.get("p") || (page === "residential" ? "/residential" : "/")); } catch {}
    const isResidential = page === "residential";
    const key = isResidential ? "visitors:unique:residential" : "visitors:unique";
    const member = isResidential
      ? createHash("sha256").update("residential:" + ip).digest("hex").slice(0, 32)
      : ip;
    await r.sadd(key, member);
    const count = await r.scard(key);

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
