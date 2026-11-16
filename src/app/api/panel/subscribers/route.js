import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { listSubscribers } from "@/lib/subscribers";
import { buildXlsx } from "@/lib/xlsx";

export const dynamic = "force-dynamic";

// Admin only. JSON list by default; ?format=xlsx downloads the current list as an Excel file.
export async function GET(request) {
  if (!(await verifySession())) return NextResponse.json({}, { status: 401 });
  const subscribers = await listSubscribers();
  const format = new URL(request.url).searchParams.get("format");
  if (format === "xlsx") {
    const rows = [["#", "Email", "Subscribed (UTC)", "Source"]].concat(
      subscribers.map((s, i) => [i + 1, s.email, (s.subscribedAt || "").replace("T", " ").slice(0, 16), s.source || ""])
    );
    const file = buildXlsx(rows, { sheetName: "Subscribers", widths: [6, 38, 20, 16] });
    const stamp = new Date().toISOString().slice(0, 10);
    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="belenko-newsletter-subscribers-${stamp}.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  }
  return NextResponse.json({
    count: subscribers.length,
    subscribers: subscribers.map((s) => ({ email: s.email, subscribedAt: s.subscribedAt, source: s.source })),
    mailerConfigured: !!process.env.RESEND_API_KEY,
  }, { headers: { "Cache-Control": "no-store" } });
}
