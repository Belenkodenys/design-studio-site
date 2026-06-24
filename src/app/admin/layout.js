import { verifySession } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";
import Sidebar from "@/components/admin/Sidebar";

export const metadata = { title: "Admin — Belenko Design" };

export default async function AdminLayout({ children }) {
  if (!(await verifySession())) return <LoginForm />;
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fa" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 24, overflow: "auto" }}>{children}</main>
    </div>
  );
}
