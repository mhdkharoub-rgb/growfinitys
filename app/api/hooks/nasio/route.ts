import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { emails, sendEmail } from "@/lib/emails";

export async function POST(req: Request) {
  const secret = process.env.ZAPIER_WEBHOOK_SECRET;
  const provided = new URL(req.url).searchParams.get("secret");
  if (secret && secret !== provided) return NextResponse.json({ error: "Bad secret" }, { status: 401 });

  const body = await req.json().catch(() => null);
  // Expected JSON from Zapier: { email, planId, action: "activate" | "cancel" | "expire", periodEnd? }
  if (!body?.email || !body?.planId || !body?.action) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = createSupabaseServer();

  // Ensure user exists
  const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1, email: body.email });
  let user = list?.users?.[0];
  if (!user) {
    await supabase.auth.admin.inviteUserByEmail(body.email);
    const { data: list2 } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1, email: body.email });
    user = list2?.users?.[0];
  }
  if (!user) return NextResponse.json({ error: "Cannot create user" }, { status: 500 });

  const statusMap: Record<string, string> = {
    activate: "active",
    cancel: "canceled",
    expire: "expired"
  };
  const status = statusMap[body.action] ?? "active";

  await supabase
    .from("subscriptions")
    .insert({
      user_id: user.id,
      plan: body.planId,
      status,
      current_period_end: body.periodEnd || null
    })
    .select()
    .single();

  if (status === "active") await sendEmail(body.email, "Welcome!", emails.welcome(body.planId));
  if (status === "expired") await sendEmail(body.email, "Your plan expired", emails.expired(body.planId));

  return NextResponse.json({ ok: true });
}
