"use client";
import { useState } from "react";

export default function ArticleImages({ content, onContentChange }) {
  const [deleting, setDeleting] = useState(null);

  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*\/?>/g;
  const images = [];
  let match;
  while ((match = imgRegex.exec(content)) !== null) images.push(match[1]);

  if (images.length === 0) return null;

  const removeImage = async (url) => {
    if (!confirm("Удалить изображение из статьи?")) return;
    setDeleting(url);
    try {
      await fetch("/api/panel/delete-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    } catch {}
    const newContent = content.replace(
      new RegExp(`\\n?<img[^>]+src="${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*\\/?>\\n?`, "g"), ""
    );
    onContentChange(newContent);
    setDeleting(null);
  };

  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
        Изображения в статье ({images.length})
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {images.map((url, i) => (
          <div key={i} style={{ position: "relative", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
            <img src={url} alt="" style={{ width: "100%", height: 128, objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0)", transition: "background .2s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,.4)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0)"}>
              <button onClick={() => removeImage(url)} disabled={deleting === url}
                style={{ background: "#ef4444", color: "#fff", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer", opacity: 0, transition: "opacity .2s" }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                {deleting === url ? "..." : "Удалить"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
