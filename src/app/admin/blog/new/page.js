"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";
import ArticleImages from "@/components/admin/ArticleImages";
import RichEditor from "@/components/admin/RichEditor";

const inputStyle = { width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 16px", fontSize: 14, outline: "none", boxSizing: "border-box" };
const cardStyle = { background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #f3f4f6", marginBottom: 16 };
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 };

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [published, setPublished] = useState(false);

  const toSlug = (t) => t.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "");
  const onTitle = (v) => { setTitle(v); if (!slug || slug === toSlug(title)) setSlug(toSlug(v)); };

  const insertImage = (html) => setContent((prev) => prev + "\n" + html + "\n");

  const save = async () => {
    if (!title || !slug) return;
    const res = await fetch("/api/panel/posts", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, content, metaTitle: metaTitle || title, metaDescription, published }),
    });
    if (res.ok) router.push("/admin/blog");
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a2332", marginBottom: 24 }}>Новая статья</h1>
      <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={labelStyle}>Заголовок</label>
          <input value={title} onChange={e => onTitle(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Slug</label>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#9ca3af" }}>
            <span>/blog/</span>
            <input value={slug} onChange={e => setSlug(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Содержание</label>
          <RichEditor value={content} onChange={setContent} />
        </div>
        <ArticleImages content={content} onContentChange={setContent} />
        <div>
          <label style={{ ...labelStyle, marginBottom: 8 }}>Добавить изображение</label>
          <ImageUploader onInsert={insertImage} />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
          <span style={{ fontSize: 13 }}>Опубликовать</span>
        </label>
      </div>
      <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 style={{ fontWeight: 600, fontSize: 13 }}>SEO</h2>
        <input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="Meta Title" style={inputStyle} />
        <textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} placeholder="Meta Description" rows={2}
          style={{ ...inputStyle, resize: "vertical" }} />
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={save} style={{ background: "#1a2332", color: "#fff", padding: "10px 24px", borderRadius: 8, fontWeight: 500, border: "none", cursor: "pointer", fontSize: 14 }}>Создать</button>
        <button onClick={() => router.back()} style={{ color: "#6b7280", fontSize: 13, background: "none", border: "none", cursor: "pointer" }}>Отмена</button>
      </div>
    </div>
  );
}
