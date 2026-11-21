"use client";
import { useState, useEffect, useMemo } from "react";

const PERIODS = [[1, "Сегодня"], [7, "7 дней"], [30, "30 дней"], [0, "Всё время"]];
const SECTIONS = [["all", "Все страницы"], ["main", "Основной сайт"], ["residential", "Residential"], ["journal", "Journal"]];
const sectionOf = (p) => p.startsWith("/residential/journal") ? "journal" : p.startsWith("/residential") ? "residential" : "main";

let regionNames = null;
function countryName(code) {
  if (!code || code === "??") return "Не определена";
  try { regionNames = regionNames || new Intl.DisplayNames(["ru"], { type: "region" }); return regionNames.of(code) || code; } catch { return code; }
}
const flag = (code) => /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0))) : "";

const btn = (on) => ({ padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", border: "1px solid " + (on ? "#1a2332" : "#e5e7eb"), background: on ? "#1a2332" : "#fff", color: on ? "#fff" : "#1a2332" });
const th = { padding: "10px 16px", textAlign: "left", color: "#6b7280", background: "#f9fafb", fontWeight: 500 };
const td = { padding: "9px 16px", borderTop: "1px solid #f3f4f6", color: "#1a2332" };
const card = { background: "#fff", borderRadius: 12, border: "1px solid #f3f4f6", overflow: "hidden", marginBottom: 28 };

export default function GeographyPage() {
  const [days, setDays] = useState(30);
  const [section, setSection] = useState("all");
  const [data, setData] = useState(null);
  const [open, setOpen] = useState({});

  useEffect(() => {
    setData(null);
    fetch("/api/panel/geo?days=" + days, { cache: "no-store" }).then((r) => r.json()).then(setData).catch(() => setData({ places: [], pages: [] }));
  }, [days]);

  const view = useMemo(() => {
    if (!data) return null;
    const places = (data.places || []).filter((p) => section === "all" || p.section === section);
    const countries = {};
    for (const p of places) {
      const c = (countries[p.country] = countries[p.country] || { code: p.country, n: 0, cities: {} });
      c.n += p.n; c.cities[p.city] = (c.cities[p.city] || 0) + p.n;
    }
    const list = Object.values(countries).sort((a, b) => b.n - a.n);
    const total = list.reduce((s, c) => s + c.n, 0);
    const pages = {};
    for (const p of data.pages || []) {
      if (section !== "all" && sectionOf(p.path) !== section) continue;
      const g = (pages[p.path] = pages[p.path] || { path: p.path, n: 0, countries: {} });
      g.n += p.n; g.countries[p.country] = (g.countries[p.country] || 0) + p.n;
    }
    return { list, total, pages: Object.values(pages).sort((a, b) => b.n - a.n).slice(0, 60) };
  }, [data, section]);

  return (
    <div style={{ maxWidth: 980 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a2332", marginBottom: 8 }}>География посещений</h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20, maxWidth: 760 }}>
        Уникальные посетители по странам и городам. Страна и город определяются по сети посетителя; адреса не сохраняются. Один человек считается один раз в день для каждого раздела и каждой страницы, поэтому за несколько дней числа складываются по дням. Данные копятся с момента включения.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {PERIODS.map(([d, l]) => <button key={d} type="button" onClick={() => setDays(d)} style={btn(days === d)}>{l}</button>)}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {SECTIONS.map(([s, l]) => <button key={s} type="button" onClick={() => setSection(s)} style={btn(section === s)}>{l}</button>)}
      </div>
      {!view ? <p style={{ fontSize: 14, color: "#6b7280" }}>Загрузка…</p> : (
        <>
          <p style={{ fontSize: 14, color: "#1a2332", marginBottom: 12 }}>Всего посещений: <b>{view.total}</b> · стран: <b>{view.list.length}</b></p>
          <div style={card}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr><th style={th}>Страна / город</th><th style={{ ...th, width: 120, textAlign: "right" }}>Посетители</th><th style={{ ...th, width: 240 }}>Доля</th></tr></thead>
              <tbody>
                {view.list.map((c) => {
                  const share = view.total ? c.n / view.total : 0, isOpen = !!open[c.code];
                  const cities = Object.entries(c.cities).sort((a, b) => b[1] - a[1]);
                  return [
                    <tr key={c.code} onClick={() => setOpen((o) => ({ ...o, [c.code]: !o[c.code] }))} style={{ cursor: "pointer" }}>
                      <td style={td}><span style={{ display: "inline-block", width: 16, color: "#9ca3af" }}>{isOpen ? "−" : "+"}</span>{flag(c.code)} {countryName(c.code)} <span style={{ color: "#9ca3af" }}>· {cities.length} {cities.length === 1 ? "город" : "городов"}</span></td>
                      <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>{c.n}</td>
                      <td style={td}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ flex: 1, height: 6, background: "#f3f4f6", borderRadius: 3 }}><div style={{ width: Math.max(2, share * 100) + "%", height: 6, background: "#1a2332", borderRadius: 3 }} /></div><span style={{ width: 44, textAlign: "right", color: "#6b7280" }}>{(share * 100).toFixed(share < 0.1 ? 1 : 0)}%</span></div></td>
                    </tr>,
                    ...(isOpen ? cities.map(([name, n]) => (
                      <tr key={c.code + name} style={{ background: "#fcfcfd" }}>
                        <td style={{ ...td, paddingLeft: 48, color: "#4b5563" }}>{name === "—" ? "Город не определён" : name}</td>
                        <td style={{ ...td, textAlign: "right", color: "#4b5563" }}>{n}</td><td style={td} />
                      </tr>
                    )) : []),
                  ];
                })}
                {view.list.length === 0 && <tr><td colSpan={3} style={{ ...td, color: "#9ca3af", padding: "24px 16px" }}>За этот период посещений пока нет.</td></tr>}
              </tbody>
            </table>
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a2332", marginBottom: 12 }}>По страницам</h2>
          <div style={card}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr><th style={th}>Страница</th><th style={{ ...th, width: 120, textAlign: "right" }}>Посетители</th><th style={th}>Страны</th></tr></thead>
              <tbody>
                {view.pages.map((p) => (
                  <tr key={p.path}>
                    <td style={td}>{p.path}</td>
                    <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>{p.n}</td>
                    <td style={{ ...td, color: "#4b5563" }}>{Object.entries(p.countries).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c, n]) => `${flag(c)} ${countryName(c)} ${n}`).join(" · ")}</td>
                  </tr>
                ))}
                {view.pages.length === 0 && <tr><td colSpan={3} style={{ ...td, color: "#9ca3af", padding: "24px 16px" }}>Нет данных.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
