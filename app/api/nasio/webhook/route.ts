import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { planFromZeroLink, secondsForPlan } from "@/lib/plans";

const NASECRET = process.env.NASIO_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    if (NASECRET) {
      const sig = req.headers.get("x-nasio-signature");
      if (sig !== NASECRET) {
        return NextResponse.json(
          { ok: false, error: "invalid signature" },
          { status: 401 }
        );
      }
    }

    const payload = await req.json();
    const email: string | undefined = payload?.email;
    const zeroLink: string | undefined = payload?.zero_link;
    const paymentStatus: string | undefined = payload?.payment_status;
    const period: "monthly" | "yearly" = payload?.period === "yearly" ? "yearly" : "monthly";

    if (!email || !zeroLink || paymentStatus !== "paid") {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const plan = planFromZeroLink(zeroLink);
    if (!plan) {
      return NextResponse.json(
        { ok: false, error: "unknown plan" },
        { status: 400 }
      );
    }

    const { data: member, error: memberErr } = await supabaseAdmin
      .from("members")
      .upsert({ email }, { onConflict: "email" })
      .select("*")
      .single();
    if (memberErr) throw memberErr;

    const now = Math.floor(Date.now() / 1000);
    const endsAt = now + secondsForPlan(plan, period === "yearly");

    const { error: subErr } = await supabaseAdmin
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
          provider_ref: zeroLink,
        },
        { onConflict: "member_id" }
      );
    if (subErr) throw subErr;

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[nasio webhook] error", e);
    return NextResponse.json({ ok: false, error: e?.message || "unknown" }, { status: 500 });
  }
}
