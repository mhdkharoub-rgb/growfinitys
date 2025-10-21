import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; planId: string };
  const supabase = createSupabaseServer();
  const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1, email: payload.email });
  const user = list?.users?.[0];
  if (!user) return NextResponse.json({ error: "No user" }, { status: 404 });

  const periodEnd =
    payload.planId.endsWith("yearly")
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await supabase
    .from("subscriptions")
    .insert({
      user_id: user.id,
      plan: payload.planId,
      status: "active",
      current_period_end: periodEnd.toISOString()
    });

  return NextResponse.json({ ok: true });
}
