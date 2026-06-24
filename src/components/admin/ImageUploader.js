"use client";
import { useRef, useState } from "react";

export default function ImageUploader({ onInsert }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [inserted, setInserted] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const upload = async (file) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/panel/upload", { method: "POST", body: form });
    if (!res.ok) { alert("Ошибка загрузки"); setUploading(false); return; }
    const { url } = await res.json();
    setPreview(url);
    setUploading(false);
    setInserted(false);
  };

  const handleFile = (e) => { const file = e.target.files?.[0]; if (file) upload(file); };

  const insert = () => {
    if (!preview) return;
    onInsert(`<img src="${preview}" alt="" style="max-width:100%;height:auto;border-radius:8px;margin:16px 0" />`);
    setInserted(true);
  };

  const deleteImage = async () => {
    if (!preview || !confirm("Удалить изображение?")) return;
    setDeleting(true);
    await fetch("/api/panel/delete-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: preview }) });
    setDeleting(false); setPreview(null); setInserted(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const reset = () => { setPreview(null); setInserted(false); if (fileRef.current) fileRef.current.value = ""; };

  return (
    <div style={{ border: "2px dashed #d1d5db", borderRadius: 8, padding: 16 }}>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} id="img-upload" />
      {!preview && !uploading && (
        <label htmlFor="img-upload" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", padding: "16px 0" }}>
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
          <span style={{ fontSize: 13, color: "#6b7280" }}>Нажмите, чтобы загрузить изображение</span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>JPG, PNG, WebP до 4.5 MB</span>
        </label>
      )}
      {uploading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "24px 0" }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>Загрузка...</span>
        </div>
      )}
      {preview && !uploading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <img src={preview} alt="Preview" style={{ maxHeight: 192, borderRadius: 8, margin: "0 auto" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {inserted ? (
              <span style={{ color: "#16a34a", fontSize: 13, fontWeight: 500 }}>Вставлено в статью</span>
            ) : (
              <button onClick={insert} style={{ background: "#1a2332", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
                Вставить в статью
              </button>
            )}
            <button onClick={deleteImage} disabled={deleting} style={{ color: "#ef4444", fontSize: 13, fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>
              {deleting ? "Удаление..." : "Удалить"}
            </button>
            <button onClick={reset} style={{ color: "#c9a87c", fontSize: 13, fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>
              Загрузить другое
            </button>
          </div>
          <input type="text" value={preview} readOnly
            style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 12px", fontSize: 11, color: "#6b7280", fontFamily: "monospace", background: "#f9fafb", boxSizing: "border-box" }}
            onClick={(e) => e.target.select()} />
        </div>
      )}
    </div>
  );
}
