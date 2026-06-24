"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Панель" },
  { href: "/admin/blog", label: "Статьи" },
  { href: "/admin/code-injection", label: "Код и аналитика" },
  { href: "/admin/meta", label: "Мета-теги" },
  { href: "/admin/robots", label: "Robots.txt" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/panel/logout", { method: "POST" });
    router.refresh();
  };

  const isActive = (href) => pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <aside style={{ width: 220, background: "#1a2332", minHeight: "100vh", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: 20, borderBottom: "1px solid rgba(255,255,255,.1)" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Belenko</span>
        <span style={{ color: "#c9a87c", fontWeight: 300, fontSize: 14, marginLeft: 4 }}>Admin</span>
      </div>
      <nav style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        {links.map((l) => (
          <Link key={l.href} href={l.href}
            style={{
              display: "block", padding: "8px 12px", borderRadius: 8, fontSize: 13, textDecoration: "none", transition: "all .15s",
              background: isActive(l.href) ? "rgba(255,255,255,.15)" : "transparent",
              color: isActive(l.href) ? "#fff" : "rgba(255,255,255,.5)",
              fontWeight: isActive(l.href) ? 500 : 400,
            }}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,.1)", display: "flex", flexDirection: "column", gap: 4 }}>
        <Link href="/" target="_blank" style={{ display: "block", padding: "8px 12px", fontSize: 13, color: "rgba(255,255,255,.3)", textDecoration: "none" }}>
          Открыть сайт &#8599;
        </Link>
        <button onClick={logout} style={{ textAlign: "left", padding: "8px 12px", fontSize: 13, color: "rgba(248,113,113,.6)", background: "none", border: "none", cursor: "pointer", borderRadius: 8 }}>
          Выйти
        </button>
      </div>
    </aside>
  );
}
