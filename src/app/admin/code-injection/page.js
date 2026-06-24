"use client";
import { useState, useEffect } from "react";

const inputStyle = { width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 16px", fontSize: 13, fontFamily: "monospace", outline: "none", resize: "vertical", boxSizing: "border-box" };
const cardStyle = { background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #f3f4f6", marginBottom: 16 };

export default function CodeInjectionPage() {
  const [headCode, setHeadCode] = useState("");
  const [bodyStartCode, setBodyStartCode] = useState("");
  const [bodyEndCode, setBodyEndCode] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/panel/code-injection").then(r => r.json()).then(d => {
      setHeadCode(d.headCode || ""); setBodyStartCode(d.bodyStartCode || ""); setBodyEndCode(d.bodyEndCode || "");
    });
  }, []);

  const save = async () => {
    await fetch("/api/panel/code-injection", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headCode, bodyStartCode, bodyEndCode }),
    });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const fields = [
    { label: "Код в <head>", hint: "Google Analytics, Яндекс.Метрика, пиксели", value: headCode, set: setHeadCode },
    { label: "Код после <body>", hint: "GTM noscript, виджеты чатов", value: bodyStartCode, set: setBodyStartCode },
    { label: "Код перед </body>", hint: "Скрипты, виджеты обратного звонка", value: bodyEndCode, set: setBodyEndCode },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a2332", marginBottom: 24 }}>Код и аналитика</h1>
      {fields.map((f, i) => (
        <div key={i} style={cardStyle}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1a2332", marginBottom: 4 }}>{f.label}</label>
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>{f.hint}</p>
          <textarea value={f.value} onChange={e => f.set(e.target.value)} rows={5} style={inputStyle} />
        </div>
      ))}
      <button onClick={save} style={{ background: "#1a2332", color: "#fff", padding: "10px 24px", borderRadius: 8, fontWeight: 500, border: "none", cursor: "pointer", fontSize: 14 }}>
        {saved ? "Сохранено!" : "Сохранить"}
      </button>
    </div>
  );
}
