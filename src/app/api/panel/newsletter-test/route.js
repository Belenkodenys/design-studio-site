import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { sendTest } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

// Admin only: sends one test announcement to the studio's own address.
export async function POST() {
  if (!(await verifySession())) return NextResponse.json({}, { status: 401 });
  try { return NextResponse.json(await sendTest()); }
  catch (e) { return NextResponse.json({ ok: false, error: String(e && e.message || e) }); }
}
