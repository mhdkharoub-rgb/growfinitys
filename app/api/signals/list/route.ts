export const runtime = "nodejs";

import { supabaseServer } from "@/lib/supabaseServer";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return new Response("Unauthorized", { status: 401 });

  const { data: signals } = await supabase.from("signals").select("*").order("created_at", { ascending: false }).limit(50);

  // join users + their latest subscription
  const { data: profiles } = await supabase.from("profiles").select("id,email,role");
  const { data: subs } = await supabase.from("subscriptions").select("user_id,plan,status").order("created_at", { ascending: false });

  const lastSubByUser = new Map<string, any>();
  (subs ?? []).forEach((s) => { if (!lastSubByUser.has(s.user_id)) lastSubByUser.set(s.user_id, s); });

  const users = (profiles ?? []).map((p) => ({
    email: p.email, role: p.role, ...(lastSubByUser.get(p.id) ?? {})
  }));

  return new Response(JSON.stringify({ signals: signals ?? [], users }), { status: 200, headers: { "Content-Type": "application/json" } });
}
