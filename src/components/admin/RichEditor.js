"use client";
import { useRef, useCallback } from "react";

const buttons = [
  { cmd: "bold", icon: "B", title: "Жирный" },
  { cmd: "italic", icon: "I", title: "Курсив" },
  { cmd: "underline", icon: "U", title: "Подчёркнутый" },
  { cmd: "strikeThrough", icon: "S", title: "Зачёркнутый" },
  { cmd: "formatBlock:h2", icon: "H2", title: "Заголовок" },
  { cmd: "formatBlock:h3", icon: "H3", title: "Подзаголовок" },
  { cmd: "formatBlock:p", icon: "¶", title: "Абзац" },
  { cmd: "formatBlock:blockquote", icon: "\"", title: "Цитата" },
  { cmd: "insertUnorderedList", icon: "•", title: "Список" },
  { cmd: "insertOrderedList", icon: "1.", title: "Нумерованный список" },
  { cmd: "removeFormat", icon: "X", title: "Очистить формат" },
];

export default function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);

  const exec = useCallback((cmdStr) => {
    if (cmdStr.startsWith("formatBlock:")) {
      document.execCommand("formatBlock", false, cmdStr.split(":")[1]);
    } else {
      document.execCommand(cmdStr, false);
    }
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const handleLink = useCallback(() => {
    const url = prompt("URL ссылки:");
    if (url) {
      document.execCommand("createLink", false, url);
      if (editorRef.current) onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: 8, background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
        {buttons.map((btn) => (
          <button key={btn.cmd} type="button" title={btn.title}
            onMouseDown={(e) => { e.preventDefault(); exec(btn.cmd); }}
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#6b7280", background: "none", border: "none", borderRadius: 4, cursor: "pointer" }}>
            {btn.icon}
          </button>
        ))}
        <button type="button" title="Ссылка"
          onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
          style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#6b7280", background: "none", border: "none", borderRadius: 4, cursor: "pointer" }}>
          Link
        </button>
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning
        onInput={handleInput} onBlur={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ minHeight: 300, padding: "12px 16px", fontSize: 14, outline: "none", lineHeight: 1.6 }} />
    </div>
  );
}
