import { NextResponse } from "next/server";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request) {
  const { password } = await request.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }
  const token = await createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true, path: "/", maxAge: 86400, sameSite: "lax",
  });
  return res;
}
