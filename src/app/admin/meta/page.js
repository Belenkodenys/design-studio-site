"use client";
import { useState, useEffect } from "react";

const pages = [
  { path: "/", label: "Главная" },
  { path: "/blog", label: "Блог" },
];

const inputStyle = { width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" };
const cardStyle = { background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #f3f4f6" };

export default function MetaPage() {
  const [overrides, setOverrides] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/panel/meta").then(r => r.json()).then(setOverrides);
  }, []);

  const update = (path, field, value) => {
    setOverrides(prev => ({ ...prev, [path]: { ...prev[path], [field]: value } }));
  };

  const save = async () => {
    await fetch("/api/panel/meta", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(overrides),
    });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a2332", marginBottom: 24 }}>Мета-теги страниц</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {pages.map(p => (
          <div key={p.path} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1a2332" }}>{p.label}</span>
              <span style={{ fontSize: 12, color: "#9ca3af", background: "#f9fafb", padding: "2px 8px", borderRadius: 4 }}>{p.path}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Title</label>
                <input type="text" value={overrides[p.path]?.title || ""} onChange={e => update(p.path, "title", e.target.value)}
                  placeholder="По умолчанию" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Description</label>
                <input type="text" value={overrides[p.path]?.description || ""} onChange={e => update(p.path, "description", e.target.value)}
                  placeholder="По умолчанию" style={inputStyle} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={save} style={{ marginTop: 24, background: "#1a2332", color: "#fff", padding: "10px 24px", borderRadius: 8, fontWeight: 500, border: "none", cursor: "pointer", fontSize: 14 }}>
        {saved ? "Сохранено!" : "Сохранить"}
      </button>
    </div>
  );
}
