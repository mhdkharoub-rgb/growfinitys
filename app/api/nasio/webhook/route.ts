import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { planFromZeroLink, secondsForPlan } from "@/lib/plans";

const NASECRET = process.env.NASIO_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    if (NASECRET && req.headers.get("x-nasio-signature") !== NASECRET)
      return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });

    const payload = await req.json();
    const { email, zero_link, payment_status, period = "monthly" } = payload;
    if (!email || !zero_link || payment_status !== "paid") return NextResponse.json({ ok: true, ignored: true });

    const plan = planFromZeroLink(zero_link);
    if (!plan) return NextResponse.json({ ok: false, error: "unknown plan" }, { status: 400 });

    const { data: member } = await supabaseAdmin
      .from("members")
      .upsert({ email }, { onConflict: "email" })
      .select("*")
      .single();

    const now = Math.floor(Date.now() / 1000);
    const endsAt = now + secondsForPlan(plan, period === "yearly");

    await supabaseAdmin
      .from("subscriptions")
      .upsert(
        {
          member_id: member.id,
          plan,
          status: "active",
          starts_at: new Date(now * 1000).toISOString(),
          ends_at: new Date(endsAt * 1000).toISOString(),
          period,
          provider: "nas.io",
          provider_ref: zero_link,
        },
        { onConflict: "member_id" }
      );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message });
  }
}
