import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { emails, sendEmail } from "@/lib/emails";

export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams?.token;
  if (!token) return <p>Missing token.</p>;

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; planId: string };
  const supabase = createSupabaseServer();

  // ensure user exists (invite if not)
  let { data: existing } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1, email: payload.email });
  if (!existing?.users?.length) {
    await supabase.auth.admin.inviteUserByEmail(payload.email);
  }

  // fetch user id (may need second try if invite)
  const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1, email: payload.email });
  const user = users?.users?.[0];
  if (!user) return <p>We couldn’t create your account yet. Please try again shortly.</p>;

  // set/update subscription
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
    })
    .select()
    .single();

  // Welcome email
  await sendEmail(payload.email, "Your Growfinitys subscription is active", emails.welcome(payload.planId));

  // success → ask user to login (magic link)
  redirect("/login");
}
