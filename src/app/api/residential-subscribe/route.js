import { NextResponse } from "next/server";
import { addSubscriber, isValidEmail, underRateLimit } from "@/lib/subscribers";

// Newsletter sign-up for the hidden /residential page.
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    // Honeypot: real visitors never fill this field.
    if (body.website) return NextResponse.json({ ok: true });
    const email = String(body.email || "").trim();
    if (!isValidEmail(email)) return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    if (body.consent !== true) return NextResponse.json({ ok: false, error: "consent_required" }, { status: 400 });

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";
    if (!(await underRateLimit(ip))) return NextResponse.json({ ok: false, error: "too_many" }, { status: 429 });

    const result = await addSubscriber(email, "residential");
    return NextResponse.json({ ok: true, already: result.already });
  } catch {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
