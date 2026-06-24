"use client";
import { useState, useEffect } from "react";

export default function RobotsPage() {
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/panel/robots").then(r => r.json()).then(d => setContent(d.content || ""));
  }, []);

  const save = async () => {
    await fetch("/api/panel/robots", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a2332", marginBottom: 8 }}>Robots.txt</h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>
        Доступен по адресу <a href="/robots.txt" target="_blank" style={{ textDecoration: "underline" }}>/robots.txt</a>
      </p>
      <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #f3f4f6" }}>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={12}
          style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 16px", fontSize: 13, fontFamily: "monospace", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
      </div>
      <button onClick={save} style={{ marginTop: 16, background: "#1a2332", color: "#fff", padding: "10px 24px", borderRadius: 8, fontWeight: 500, border: "none", cursor: "pointer", fontSize: 14 }}>
        {saved ? "Сохранено!" : "Сохранить"}
      </button>
    </div>
  );
}
