import { redirect } from "next/navigation";
import { AdminPanel } from "./AdminPanel";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function AdminPage() {
  const supabase = supabaseServer();

  if (!supabase) {
    redirect("/login");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return <AdminPanel />;
}
