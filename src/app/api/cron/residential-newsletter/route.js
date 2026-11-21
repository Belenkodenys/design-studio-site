import { NextResponse } from "next/server";
import { runCheck } from "@/lib/newsletter";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Called hourly by Vercel Cron (see vercel.json). With CRON_SECRET set, only Vercel may call it.
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({}, { status: 401 });
  try { return NextResponse.json(await runCheck(), { headers: { "Cache-Control": "no-store" } }); }
  catch (e) { return NextResponse.json({ ok: false, error: String(e && e.message || e) }, { status: 500 }); }
}
