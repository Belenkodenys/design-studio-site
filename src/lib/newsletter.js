// Newsletter announcements for the Residential section.
// A new project or journal article in /residential/feed.json is announced to every subscriber.
// Flow: the hourly cron notices a new item -> the studio gets a preview with "send now" / "do not send"
// links -> if nobody intervenes, the announcement goes out HOLD_HOURS later.
import Redis from "ioredis";
import crypto from "crypto";
import { Resend } from "resend";
import { listSubscribers } from "@/lib/subscribers";

export const SITE = "https://www.belenko.design";
export const HOLD_HOURS = 24;
const K_SEEDED = "newsletter:residential:seeded";
const K_DONE = "newsletter:residential:announced";   // set of item ids already sent or skipped
const K_PENDING = "newsletter:residential:pending";   // hash id -> ISO time the item was first seen
const OWNER = process.env.NEWSLETTER_OWNER || "office@belenko.design";
const FROM = process.env.NEWSLETTER_FROM || "Belenko Design <office@belenko.design>";

let redis = null;
function getRedis() {
  if (redis) return redis;
  if (!process.env.REDIS_URL) return null;
  redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1, lazyConnect: true, connectTimeout: 3000, commandTimeout: 5000 });
  return redis;
}

const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function sign(action, id) {
  const secret = process.env.ADMIN_PASSWORD || process.env.REDIS_URL || "";
  return crypto.createHmac("sha256", "newsletter:" + secret).update(action + ":" + id).digest("hex").slice(0, 32);
}
export function validSig(action, id, sig) {
  const a = Buffer.from(sign(action, id)), b = Buffer.from(String(sig || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function loadFeed() {
  const r = await fetch(SITE + "/residential/feed.json", { cache: "no-store" });
  if (!r.ok) throw new Error("feed " + r.status);
  const d = await r.json();
  return Array.isArray(d.items) ? d.items : [];
}

// One email. `unsubscribeUrl` is per subscriber; `banner` is the studio-only note above a preview.
export function renderEmail(item, { unsubscribeUrl = "", banner = "" } = {}) {
  const isArticle = item.type === "article";
  const eyebrow = isArticle ? "New in the journal" : "New project";
  const cta = isArticle ? "Read the article" : "View the project";
  const F = "'Oswald','Arial Narrow',Arial,Helvetica,sans-serif";
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(item.title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400&display=swap" rel="stylesheet"></head>
<body style="margin:0;padding:0;background:#EEEEEC;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(eyebrow)}: ${esc(item.title)} — Belenko Design, Barcelona</div>
${banner ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF6D6;"><tr><td align="center" style="padding:18px 16px;font:14px/1.5 Arial,Helvetica,sans-serif;color:#171719;">${banner}</td></tr></table>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEEEEC;"><tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#FFFFFF;">
<tr><td bgcolor="#171719" style="background:#171719;padding:28px 36px;"><a href="${SITE}/residential" style="text-decoration:none;"><img src="${SITE}/residential/belenko-logo-white.png" alt="Belenko" height="24" style="height:24px;width:auto;display:block;border:0;"></a></td></tr>
${item.image ? `<tr><td><a href="${esc(item.url)}"><img src="${esc(item.image)}" alt="${esc(item.title)}" width="600" style="width:100%;max-width:600px;height:auto;display:block;border:0;"></a></td></tr>` : ""}
<tr><td style="padding:40px 36px 12px;font-family:${F};font-weight:300;font-size:12px;line-height:1.4;letter-spacing:0.14em;text-transform:uppercase;color:#77766F;">${esc(eyebrow)}</td></tr>
<tr><td style="padding:0 36px 18px;font-family:${F};font-weight:200;font-size:34px;line-height:1.12;letter-spacing:0.03em;text-transform:uppercase;color:#171719;">${esc(item.title)}</td></tr>
<tr><td style="padding:0 36px 30px;font-family:${F};font-weight:300;font-size:15px;line-height:1.6;letter-spacing:0.02em;text-transform:uppercase;color:#171719;">${esc(item.text)}</td></tr>
<tr><td style="padding:0 36px 44px;"><a href="${esc(item.url)}" style="display:inline-block;border:1px solid #171719;padding:14px 26px;font-family:${F};font-weight:400;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:#171719;text-decoration:none;">+ &nbsp; ${cta}</a></td></tr>
<tr><td bgcolor="#FFFFFF" style="background:#FFFFFF;border-top:1px solid #DDDCD7;padding:26px 36px 34px;font-family:${F};font-weight:300;font-size:12px;line-height:1.7;letter-spacing:0.08em;text-transform:uppercase;color:#171719;">
Belenko Design Studio<br>
<span style="color:#55554F;">You receive this email because you subscribed to Belenko news.</span>${unsubscribeUrl ? `<br><a href="${esc(unsubscribeUrl)}" style="color:#171719;text-decoration:underline;">Unsubscribe</a>` : ""}
</td></tr></table></td></tr></table></body></html>`;
  const text = `${eyebrow}: ${item.title}\n\n${item.text}\n\n${cta}: ${item.url}\n\nBelenko Design Studio${unsubscribeUrl ? `\nUnsubscribe: ${unsubscribeUrl}` : ""}`;
  const subject = `${eyebrow}: ${item.title} — Belenko Design`;
  return { subject, html, text };
}

function mailer() { return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null; }

async function sendPreview(item, count) {
  const m = mailer(); if (!m) return false;
  const link = (a) => `${SITE}/api/residential-newsletter?do=${a}&id=${encodeURIComponent(item.id)}&sig=${sign(a, item.id)}`;
  const banner = `<b>Preview for the studio.</b> This announcement will be sent to ${count} subscriber${count === 1 ? "" : "s"} in ${HOLD_HOURS} hours.<br>
<a href="${link("send")}" style="color:#171719;font-weight:bold;">Send now</a> &nbsp;·&nbsp; <a href="${link("skip")}" style="color:#171719;font-weight:bold;">Do not send</a>`;
  const e = renderEmail(item, { banner });
  const r = await m.emails.send({ from: FROM, to: OWNER, subject: "[Preview] " + e.subject, html: e.html, text: e.text });
  return !r.error;
}

// Sends the announcement to every subscriber. Returns { sent, failed }.
export async function sendToAll(item) {
  const m = mailer(); if (!m) throw new Error("mailer_not_configured");
  const subs = await listSubscribers();
  let sent = 0, failed = 0;
  for (let i = 0; i < subs.length; i += 100) {
    const batch = subs.slice(i, i + 100).map((s) => {
      const unsub = `${SITE}/api/residential-unsubscribe?t=${s.token}`;
      const e = renderEmail(item, { unsubscribeUrl: unsub });
      return { from: FROM, to: s.email, subject: e.subject, html: e.html, text: e.text, headers: { "List-Unsubscribe": `<${unsub}>` } };
    });
    const r = await m.batch.send(batch);
    if (r.error) failed += batch.length; else sent += batch.length;
  }
  return { sent, failed };
}

export async function getItem(id) { return (await loadFeed()).find((x) => x.id === id) || null; }

// Manual decision from the preview email. action: "send" | "skip".
export async function decide(action, id) {
  const r = getRedis(); if (!r) throw new Error("redis");
  if (await r.sismember(K_DONE, id)) return { ok: true, already: true };
  if (action === "skip") { await r.sadd(K_DONE, id); await r.hdel(K_PENDING, id); return { ok: true, skipped: true }; }
  const item = await getItem(id); if (!item) return { ok: false, error: "not_found" };
  await r.sadd(K_DONE, id); await r.hdel(K_PENDING, id);   // mark first: never send twice
  return { ok: true, ...(await sendToAll(item)) };
}

// Hourly check.
export async function runCheck() {
  const r = getRedis(); if (!r) return { ok: false, error: "redis" };
  const items = await loadFeed();
  if (!(await r.get(K_SEEDED))) {            // first run: everything already on the site counts as announced
    if (items.length) await r.sadd(K_DONE, ...items.map((x) => x.id));
    await r.set(K_SEEDED, new Date().toISOString());
    return { ok: true, seeded: items.length };
  }
  if (!mailer()) return { ok: true, mailer: false };
  const done = new Set(await r.smembers(K_DONE)), pending = (await r.hgetall(K_PENDING)) || {};
  const out = { ok: true, queued: [], sent: [] };
  for (const item of items) {
    if (done.has(item.id)) continue;
    if (!pending[item.id]) {
      const subs = await listSubscribers();
      if (await sendPreview(item, subs.length)) { await r.hset(K_PENDING, item.id, new Date().toISOString()); out.queued.push(item.id); }
      continue;
    }
    if (Date.now() - Date.parse(pending[item.id]) >= HOLD_HOURS * 3600e3) {
      await r.sadd(K_DONE, item.id); await r.hdel(K_PENDING, item.id);
      out.sent.push({ id: item.id, ...(await sendToAll(item)) });
    }
  }
  return out;
}

// Admin "send me a test": the newest item, exactly as subscribers get it, sent to the studio only.
export async function sendTest() {
  const m = mailer(); if (!m) return { ok: false, error: "Почтовый сервис не подключён (нет RESEND_API_KEY)." };
  const items = await loadFeed(); const item = items[items.length - 1];
  if (!item) return { ok: false, error: "В ленте нет ни одного проекта или статьи." };
  const e = renderEmail(item, { unsubscribeUrl: SITE + "/api/residential-unsubscribe?t=test" });
  const r = await m.emails.send({ from: FROM, to: OWNER, subject: "[Test] " + e.subject, html: e.html, text: e.text });
  if (r.error) return { ok: false, error: r.error.message || String(r.error) };
  return { ok: true, to: OWNER, title: item.title };
}
