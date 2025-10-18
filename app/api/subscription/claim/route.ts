export const runtime = "nodejs";

import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json().catch(() => ({}));
  const plan = (body.plan || body?.plan_code)?.toString();
  const emailOverride = body.email as string | undefined;

  if (!plan || !["basic","basic-yearly","pro","pro-yearly","vip","vip-yearly"].includes(plan))
    return new Response("Invalid plan", { status: 400 });

  const email = emailOverride ?? user.email!;
  // Ensure profile exists
  await supabase.from("profiles").upsert({ id: user.id, email }, { onConflict: "id" });

  // Upsert active subscription
  await supabase.from("subscriptions").insert({
    user_id: user.id,
    plan,
    status: "active",
    current_period_end: null
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
}
