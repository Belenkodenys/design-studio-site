import { decide, validSig, getItem } from "@/lib/newsletter";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Links from the studio's preview email: ?do=send|skip&id=<item>&sig=<signature>.
// GET only shows a confirmation button (mail scanners open links); the POST acts.
const page = (body) => new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>Belenko newsletter</title></head><body style="margin:0;background:#171719;color:#F1F0EC;font:16px/1.6 Arial,Helvetica,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center"><div style="max-width:520px;padding:32px">${body}</div></body></html>`, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" } });
const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function read(request) {
  const q = new URL(request.url).searchParams;
  const action = q.get("do"), id = q.get("id") || "", sig = q.get("sig") || "";
  return { action, id, sig, ok: (action === "send" || action === "skip") && validSig(action, id, sig) };
}

export async function GET(request) {
  const p = read(request);
  if (!p.ok) return page("<p>This link is not valid.</p>");
  const item = await getItem(p.id).catch(() => null);
  const label = p.action === "send" ? "Send to all subscribers now" : "Do not send this announcement";
  return page(`<p>${esc(item ? item.title : p.id)}</p><form method="post"><button style="font:inherit;padding:14px 26px;border:1px solid #F1F0EC;background:none;color:#F1F0EC;cursor:pointer;letter-spacing:.08em;text-transform:uppercase">${label}</button></form>`);
}

export async function POST(request) {
  const p = read(request);
  if (!p.ok) return page("<p>This link is not valid.</p>");
  try {
    const r = await decide(p.action, p.id);
    if (r.already) return page("<p>This announcement was already sent or cancelled.</p>");
    if (r.skipped) return page("<p>Cancelled. This announcement will not be sent.</p>");
    if (!r.ok) return page("<p>The item was not found on the site.</p>");
    return page(`<p>Sent to ${r.sent} subscriber${r.sent === 1 ? "" : "s"}${r.failed ? `, ${r.failed} failed` : ""}.</p>`);
  } catch (e) { return page("<p>Could not send: " + esc(e && e.message) + "</p>"); }
}
