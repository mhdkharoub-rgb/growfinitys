import { requireAdmin } from "@/lib/auth";
import AdminPanel from "@/components/AdminPanel";

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) return <p>Not authorized.</p>;
  return <AdminPanel />;
}
