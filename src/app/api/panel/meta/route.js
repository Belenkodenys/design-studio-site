import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getMetaOverrides, saveMetaOverrides } from "@/lib/storage";

export async function GET() {
  if (!(await verifySession())) return NextResponse.json({}, { status: 401 });
  return NextResponse.json(await getMetaOverrides());
}

export async function PUT(request) {
  if (!(await verifySession())) return NextResponse.json({}, { status: 401 });
  await saveMetaOverrides(await request.json());
  return NextResponse.json({ ok: true });
}
