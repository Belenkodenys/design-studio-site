import { NextResponse } from "next/server";
import Redis from "ioredis";
import { verifySession } from "@/lib/auth";
import { readGeo } from "@/lib/geo";

export const dynamic = "force-dynamic";

let redis = null;
function getRedis() {
  if (redis) return redis;
  if (!process.env.REDIS_URL) return null;
  redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1, lazyConnect: true, connectTimeout: 3000, commandTimeout: 5000 });
  return redis;
}

// Admin only. ?days=1|7|30|0 (0 = all time)
export async function GET(request) {
  if (!(await verifySession())) return NextResponse.json({}, { status: 401 });
  const r = getRedis();
  if (!r) return NextResponse.json({ places: [], pages: [] });
  const d = Number(new URL(request.url).searchParams.get("days"));
  const days = [1, 7, 30].includes(d) ? d : 0;
  try { return NextResponse.json({ days, ...(await readGeo(r, days)) }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ places: [], pages: [] }, { status: 500 }); }
}
