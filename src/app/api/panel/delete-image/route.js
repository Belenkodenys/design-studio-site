import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function POST(request) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "No URL" }, { status: 400 });
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      await fetch("https://blob.vercel-storage.com/delete", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "x-api-version": "7" },
        body: JSON.stringify({ urls: [url] }),
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
