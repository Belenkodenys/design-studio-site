import Link from "next/link";

const cards = [
  { href: "/admin/blog", title: "Статьи", desc: "Создание и редактирование блога" },
  { href: "/admin/code-injection", title: "Код и аналитика", desc: "Пиксели, счётчики, скрипты" },
  { href: "/admin/meta", title: "Мета-теги", desc: "Title и Description страниц" },
  { href: "/admin/robots", title: "Robots.txt", desc: "Правила индексации" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a2332", marginBottom: 24 }}>Панель управления</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {cards.map((c) => (
          <Link key={c.href} href={c.href}
            style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #f3f4f6", textDecoration: "none", transition: "box-shadow .2s", display: "block" }}>
            <h2 style={{ fontWeight: 700, color: "#1a2332", marginBottom: 4, fontSize: 15 }}>{c.title}</h2>
            <p style={{ fontSize: 13, color: "#9ca3af" }}>{c.desc}</p>
          </Link>
        ))}
      </div>
      <p style={{ marginTop: 24, fontSize: 13, color: "#9ca3af" }}>
        <strong>Sitemap.xml</strong> генерируется автоматически: <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>/sitemap.xml</code>
      </p>
    </div>
  );
}
