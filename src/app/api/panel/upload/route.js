import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function POST(request) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN not configured" }, { status: 500 });
    }

    const pathname = `blog/${Date.now()}-${file.name}`;
    const res = await fetch(`https://blob.vercel-storage.com/${pathname}?access=public`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-version": "7",
        "x-content-type": file.type || "application/octet-stream",
      },
      body: file,
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Blob API error: ${res.status} ${text}` }, { status: 500 });
    }

    const blob = await res.json();
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    return NextResponse.json({ error: String(err.message) }, { status: 500 });
  }
}
