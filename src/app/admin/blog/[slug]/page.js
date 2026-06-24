"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";
import ArticleImages from "@/components/admin/ArticleImages";
import RichEditor from "@/components/admin/RichEditor";

const LOCALES = ["ru", "en", "uk", "es"];
const LOCALE_LABELS = { ru: "RU", en: "EN", uk: "UK", es: "ES" };

const inputStyle = { width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 16px", fontSize: 14, outline: "none", boxSizing: "border-box" };
const cardStyle = { background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #f3f4f6", marginBottom: 16 };
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 };

export default function EditPost() {
  const router = useRouter();
  const { slug } = useParams();
  const [title, setTitle] = useState("");
  const [newSlug, setNewSlug] = useState(slug);
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [published, setPublished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("ru");
  const [translations, setTranslations] = useState({
    en: { title: "", content: "", metaTitle: "", metaDescription: "" },
    uk: { title: "", content: "", metaTitle: "", metaDescription: "" },
    es: { title: "", content: "", metaTitle: "", metaDescription: "" },
  });

  useEffect(() => {
    fetch(`/api/panel/posts/${slug}`).then(r => r.json()).then(d => {
      setTitle(d.title || ""); setContent(d.content || "");
      setMetaTitle(d.metaTitle || ""); setMetaDescription(d.metaDescription || "");
      setPublished(d.published || false); setNewSlug(slug);
      if (d.translations) {
        setTranslations(prev => {
          const next = { ...prev };
          for (const loc of ["en", "uk", "es"]) {
            if (d.translations[loc]) {
              next[loc] = {
                title: d.translations[loc].title || "",
                content: d.translations[loc].content || "",
                metaTitle: d.translations[loc].metaTitle || "",
                metaDescription: d.translations[loc].metaDescription || "",
              };
            }
          }
          return next;
        });
      }
    });
  }, [slug]);

  const updateTranslation = (locale, field, value) => {
    setTranslations(prev => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }));
  };

  const insertImage = (html) => {
    if (activeTab === "ru") {
      setContent(prev => prev + "\n" + html + "\n");
    } else {
      updateTranslation(activeTab, "content", translations[activeTab].content + "\n" + html + "\n");
    }
  };

  const save = async () => {
    const filteredTranslations = {};
    for (const [loc, tr] of Object.entries(translations)) {
      if (tr.title || tr.content || tr.metaTitle || tr.metaDescription) {
        filteredTranslations[loc] = tr;
      }
    }
    const res = await fetch(`/api/panel/posts/${slug}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, content, metaTitle, metaDescription, published,
        newSlug: newSlug !== slug ? newSlug : undefined,
        translations: Object.keys(filteredTranslations).length > 0 ? filteredTranslations : undefined,
      }),
    });
    if (res.ok && newSlug !== slug) router.replace(`/admin/blog/${newSlug}`);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const tabStyle = (loc) => ({
    padding: "8px 16px", fontSize: 13, fontWeight: 500, border: "1px solid #f3f4f6", borderBottom: "none",
    borderRadius: "8px 8px 0 0", cursor: "pointer", transition: "all .15s",
    background: activeTab === loc ? "#fff" : "#f9fafb",
    color: activeTab === loc ? "#1a2332" : "#9ca3af",
  });

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a2332", marginBottom: 4 }}>Редактирование</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>
        <span>/blog/</span>
        <input value={newSlug} onChange={e => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          style={{ border: "1px solid #e5e7eb", borderRadius: 4, padding: "4px 8px", fontSize: 13, width: 200, outline: "none" }} />
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 0 }}>
        {LOCALES.map(loc => (
          <button key={loc} onClick={() => setActiveTab(loc)} style={tabStyle(loc)}>
            {LOCALE_LABELS[loc]}
            {loc === "ru" && <span style={{ marginLeft: 4, fontSize: 11, color: "#9ca3af" }}>(осн.)</span>}
          </button>
        ))}
      </div>

      {activeTab === "ru" && (
        <>
          <div style={{ ...cardStyle, borderTopLeftRadius: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Заголовок</label>
              <input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
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
              <span style={{ fontSize: 13 }}>Опубликовано</span>
            </label>
          </div>
          <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 style={{ fontWeight: 600, fontSize: 13 }}>SEO</h2>
            <input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="Meta Title" style={inputStyle} />
            <textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} placeholder="Meta Description" rows={2}
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>
        </>
      )}

      {activeTab !== "ru" && (
        <>
          <div style={{ ...cardStyle, borderTopLeftRadius: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Заголовок ({LOCALE_LABELS[activeTab]})</label>
              <input value={translations[activeTab]?.title || ""} onChange={e => updateTranslation(activeTab, "title", e.target.value)}
                placeholder={title || "Заголовок не задан"} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Содержание ({LOCALE_LABELS[activeTab]})</label>
              <RichEditor value={translations[activeTab]?.content || ""} onChange={(val) => updateTranslation(activeTab, "content", val)} />
            </div>
            <div>
              <label style={{ ...labelStyle, marginBottom: 8 }}>Добавить изображение</label>
              <ImageUploader onInsert={insertImage} />
            </div>
          </div>
          <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 style={{ fontWeight: 600, fontSize: 13 }}>SEO ({LOCALE_LABELS[activeTab]})</h2>
            <input value={translations[activeTab]?.metaTitle || ""} onChange={e => updateTranslation(activeTab, "metaTitle", e.target.value)}
              placeholder={metaTitle || "Meta Title"} style={inputStyle} />
            <textarea value={translations[activeTab]?.metaDescription || ""} onChange={e => updateTranslation(activeTab, "metaDescription", e.target.value)}
              placeholder={metaDescription || "Meta Description"} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>
            Если перевод не заполнен, будет показан основной контент (RU).
          </p>
        </>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={save} style={{ background: "#1a2332", color: "#fff", padding: "10px 24px", borderRadius: 8, fontWeight: 500, border: "none", cursor: "pointer", fontSize: 14 }}>
          {saved ? "Сохранено!" : "Сохранить"}
        </button>
        <button onClick={() => router.push("/admin/blog")} style={{ color: "#6b7280", fontSize: 13, background: "none", border: "none", cursor: "pointer" }}>Назад</button>
      </div>
    </div>
  );
}
