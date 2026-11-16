import { removeByToken } from "@/lib/subscribers";

// One-click unsubscribe link used in newsletter emails: /api/residential-unsubscribe?t=<token>
export async function GET(request) {
  const token = new URL(request.url).searchParams.get("t") || "";
  let done = false;
  try { done = await removeByToken(token); } catch {}
  const text = done
    ? "You have been unsubscribed. You will not receive further emails from Belenko."
    : "This unsubscribe link is no longer valid, or the address was already removed.";
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>Belenko — Unsubscribe</title></head><body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#171719;color:#F1F0EC;font-family:Helvetica,Arial,sans-serif;font-weight:300;text-align:center;padding:24px"><p style="max-width:420px;font-size:18px;line-height:1.6">${text}</p></body></html>`;
  return new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex, nofollow" } });
}
