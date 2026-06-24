"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const load = () => fetch("/api/panel/posts").then(r => r.json()).then(setPosts);
  useEffect(() => { load(); }, []);

  const del = async (slug) => {
    if (!confirm("Удалить?")) return;
    await fetch(`/api/panel/posts/${slug}`, { method: "DELETE" });
    load();
  };

  const cardStyle = { background: "#fff", borderRadius: 12, border: "1px solid #f3f4f6", overflow: "hidden" };
  const thStyle = { padding: "12px 20px", fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".05em", textAlign: "left", background: "#f9fafb" };
  const tdStyle = { padding: "12px 20px", borderTop: "1px solid #f3f4f6" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a2332" }}>Статьи</h1>
        <Link href="/admin/blog/new" style={{ background: "#c9a87c", color: "#fff", padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
          + Новая
        </Link>
      </div>
      {posts.length === 0 ? (
        <p style={{ color: "#9ca3af", padding: "48px 0", textAlign: "center" }}>Статей пока нет</p>
      ) : (
        <div style={cardStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <th style={thStyle}>Заголовок</th><th style={thStyle}>Статус</th><th style={thStyle}>Дата</th><th style={thStyle}></th>
            </tr></thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.slug}>
                  <td style={{ ...tdStyle, fontWeight: 500, color: "#1a2332" }}>{p.title}</td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 999, background: p.published ? "#f0fdf4" : "#fefce8", color: p.published ? "#16a34a" : "#ca8a04" }}>
                      {p.published ? "Опубл." : "Черновик"}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 13, color: "#9ca3af" }}>{new Date(p.createdAt).toLocaleDateString("ru-RU")}</td>
                  <td style={{ ...tdStyle, textAlign: "right", fontSize: 13 }}>
                    <Link href={`/admin/blog/${p.slug}`} style={{ color: "#c9a87c", marginRight: 12, textDecoration: "none" }}>Ред.</Link>
                    <button onClick={() => del(p.slug)} style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
