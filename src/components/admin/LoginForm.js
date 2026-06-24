"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/panel/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) router.refresh();
    else setError("Неверный пароль");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa" }}>
      <form onSubmit={submit} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 10px 40px rgba(0,0,0,.08)", padding: 32, width: "100%", maxWidth: 380 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, textAlign: "center", color: "#1a2332", marginBottom: 4 }}>Belenko Design</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", marginBottom: 24 }}>Панель администратора</p>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 16px", fontSize: 14, marginBottom: 12, outline: "none", boxSizing: "border-box" }}
          placeholder="Пароль" autoFocus />
        {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <button style={{ width: "100%", background: "#1a2332", color: "#fff", padding: "12px 0", borderRadius: 8, fontWeight: 500, border: "none", cursor: "pointer", fontSize: 14 }}>Войти</button>
      </form>
    </div>
  );
}
