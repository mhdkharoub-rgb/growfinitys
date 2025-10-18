import { supabaseServer } from "@/lib/supabaseServer";
import { isAdmin } from "@/lib/auth";
import AdminPanel from "@/components/AdminPanel";

export default async function AdminPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div>Not authorized.</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <AdminPanel />
    </div>
  );
}
