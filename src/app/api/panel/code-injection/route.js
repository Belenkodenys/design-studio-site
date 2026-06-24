import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getCodeInjection, saveCodeInjection } from "@/lib/storage";

export async function GET() {
  if (!(await verifySession())) return NextResponse.json({}, { status: 401 });
  return NextResponse.json(await getCodeInjection());
}

export async function PUT(request) {
  if (!(await verifySession())) return NextResponse.json({}, { status: 401 });
  const body = await request.json();
  await saveCodeInjection({
    headCode: body.headCode || "",
    bodyStartCode: body.bodyStartCode || "",
    bodyEndCode: body.bodyEndCode || "",
  });
  return NextResponse.json({ ok: true });
}
