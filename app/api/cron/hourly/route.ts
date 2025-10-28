import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";

export async function GET() {
  try {
    const now = new Date().toISOString();
    const { data: signals } = await supabaseAdmin
      .from("signals")
      .select("*")
      .eq("status", "queued")
      .lte("scheduled_at", now);

    let sentCount = 0;
    for (const s of signals || []) {
      const { data: subs } = await supabaseAdmin.rpc("active_subscribers_for_audience", { p_audience: s.audience });
      const emails = (subs || []).map((x: any) => x.email);
      const subject = `📈 ${s.title || "New Signal"}`;
      const html = `<h3>${s.title}</h3><p>${s.symbol} - ${s.type}</p>`;
      await sendEmail({ to: emails, subject, html });
      sentCount += emails.length;
      await supabaseAdmin.from("signals").update({ status: "sent", sent_at: now }).eq("id", s.id);
    }

    return NextResponse.json({ ok: true, sentCount });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message });
  }
}
