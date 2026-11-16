"use client";
import { useState, useEffect } from "react";

export default function SubscribersPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/panel/subscribers", { cache: "no-store" }).then(r => r.json()).then(setData).catch(() => setData({ count: 0, subscribers: [] }));
  }, []);

  const list = data?.subscribers || [];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a2332", marginBottom: 8 }}>Подписчики рассылки</h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>
        Адреса, оставленные в форме подписки на странице /residential. Таблица Excel собирается из базы в момент скачивания и всегда актуальна.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <a href="/api/panel/subscribers?format=xlsx"
          style={{ background: "#1a2332", color: "#fff", padding: "10px 24px", borderRadius: 8, fontWeight: 500, textDecoration: "none", fontSize: 14 }}>
          Скачать Excel
        </a>
        <span style={{ fontSize: 14, color: "#1a2332" }}>{data ? `Всего: ${data.count}` : "Загрузка…"}</span>
        {data && (
          <span style={{ fontSize: 13, color: data.mailerConfigured ? "#15803d" : "#b45309" }}>
            {data.mailerConfigured ? "Почтовый сервис подключён" : "Почтовый сервис для рассылок не подключён"}
          </span>
        )}
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f3f4f6", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#6b7280", background: "#f9fafb" }}>
              <th style={{ padding: "10px 16px", width: 48 }}>#</th>
              <th style={{ padding: "10px 16px" }}>Email</th>
              <th style={{ padding: "10px 16px" }}>Дата подписки (UTC)</th>
              <th style={{ padding: "10px 16px" }}>Источник</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s, i) => (
              <tr key={s.email} style={{ borderTop: "1px solid #f3f4f6" }}>
                <td style={{ padding: "10px 16px", color: "#9ca3af" }}>{i + 1}</td>
                <td style={{ padding: "10px 16px", color: "#1a2332" }}>{s.email}</td>
                <td style={{ padding: "10px 16px", color: "#6b7280" }}>{(s.subscribedAt || "").replace("T", " ").slice(0, 16)}</td>
                <td style={{ padding: "10px 16px", color: "#6b7280" }}>{s.source}</td>
              </tr>
            ))}
            {data && list.length === 0 && (
              <tr><td colSpan={4} style={{ padding: "24px 16px", color: "#9ca3af" }}>Пока никто не подписался.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
