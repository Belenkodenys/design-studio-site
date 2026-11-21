// Geography of visits. Counts unique visitors per day by section / country / city and by page / country.
// Country and city come from Vercel's edge headers; no IP address is stored (only a daily salted hash, kept 3 days for de-duplication).
import crypto from "crypto";

const DAY_TTL = 400 * 86400;
const day = (d = new Date()) => d.toISOString().slice(0, 10);
const clean = (s, max) => String(s || "").replace(/[|\r\n]/g, " ").trim().slice(0, max);

export function sectionOf(path) {
  if (path.startsWith("/residential/journal")) return "journal";
  if (path.startsWith("/residential")) return "residential";
  return "main";
}

export async function recordVisit(r, request, rawPath) {
  const h = request.headers;
  const country = clean(h.get("x-vercel-ip-country"), 2).toUpperCase() || "??";
  let city = h.get("x-vercel-ip-city") || "";
  try { city = decodeURIComponent(city); } catch {}
  city = clean(city, 60) || "—";
  let path = clean(rawPath, 120) || "/";
  if (!path.startsWith("/")) path = "/";
  path = path.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  const ua = h.get("user-agent") || "";
  if (/bot|crawl|spider|slurp|preview|headless|lighthouse|monitor/i.test(ua)) return;
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const d = day();
  const who = crypto.createHash("sha256").update("geo:" + d + ":" + ip).digest("hex").slice(0, 24);
  const section = sectionOf(path);
  const seen = "geo:seen:" + d;
  const p = r.pipeline();
  p.sadd(seen, who + "|s|" + section);
  p.sadd(seen, who + "|p|" + path);
  p.expire(seen, 3 * 86400);
  const res = await p.exec();
  const q = r.pipeline();
  if (res[0][1] === 1) {
    const f = section + "|" + country + "|" + city;
    q.hincrby("geo:d:" + d, f, 1); q.expire("geo:d:" + d, DAY_TTL); q.hincrby("geo:all", f, 1);
  }
  if (res[1][1] === 1) {
    const f = path + "|" + country;
    q.hincrby("geo:p:" + d, f, 1); q.expire("geo:p:" + d, DAY_TTL); q.hincrby("geo:pall", f, 1);
  }
  if (q.length) await q.exec();
}

// days: 1 | 7 | 30 | 0 (all time)
export async function readGeo(r, days) {
  const merge = (into, h) => { for (const [k, v] of Object.entries(h || {})) into[k] = (into[k] || 0) + Number(v); };
  const places = {}, pages = {};
  if (!days) { merge(places, await r.hgetall("geo:all")); merge(pages, await r.hgetall("geo:pall")); }
  else {
    const p = r.pipeline();
    for (let i = 0; i < days; i++) { const d = day(new Date(Date.now() - i * 86400e3)); p.hgetall("geo:d:" + d); p.hgetall("geo:p:" + d); }
    const res = await p.exec();
    res.forEach(([, h], i) => merge(i % 2 ? pages : places, h));
  }
  return {
    places: Object.entries(places).map(([k, n]) => { const [section, country, city] = k.split("|"); return { section, country, city, n }; }),
    pages: Object.entries(pages).map(([k, n]) => { const i = k.lastIndexOf("|"); return { path: k.slice(0, i), country: k.slice(i + 1), n }; }),
  };
}
