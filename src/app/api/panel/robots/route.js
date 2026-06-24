import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getRobotsContent, saveRobotsContent } from "@/lib/storage";

export async function GET() {
  if (!(await verifySession())) return NextResponse.json({}, { status: 401 });
  return NextResponse.json({ content: await getRobotsContent() });
}

export async function PUT(request) {
  if (!(await verifySession())) return NextResponse.json({}, { status: 401 });
  const { content } = await request.json();
  await saveRobotsContent(content || "");
  return NextResponse.json({ ok: true });
}
