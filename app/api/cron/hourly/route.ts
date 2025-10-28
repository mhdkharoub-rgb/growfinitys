import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const nowIso = new Date().toISOString();

    // 1) Fetch queued signals scheduled for now or earlier
    const { data: signals, error: sigErr } = await supabaseAdmin
      .from("signals")
      .select("*")
      .eq("status", "queued")
      .lte("scheduled_at", nowIso)
      .limit(50);
    if (sigErr) throw sigErr;

    let delivered = 0;

    for (const s of signals ?? []) {
      // 2) Fetch active members whose plan qualifies for this signal audience
      const { data: subs, error: subsErr } = await supabaseAdmin
        .rpc("active_subscribers_for_audience", { p_audience: s.audience });
      if (subsErr) throw subsErr;

      // 3) Email each active member (simple channel for now)
      //    You can optionally branch by channel (email/telegram) later.
      const subject = `📈 ${s.title || "New Signal"} — ${s.symbol ?? s.pair ?? ""}`;
      const tp2Html = s.tp2 ? `&nbsp;&nbsp;<b>TP2:</b> ${s.tp2}` : "";
      const html = `
        <div style="font-family:Inter,Arial,sans-serif;">
          <h2>Growfinitys Trading Signal</h2>
          <p><b>Market:</b> ${s.symbol ?? s.pair ?? "N/A"}</p>
          <p><b>Type:</b> ${s.type ?? "N/A"} &nbsp;&nbsp; <b>Risk:</b> ${s.risk ?? "—"}</p>
          <p><b>Entry:</b> ${s.entry ?? "—"} &nbsp;&nbsp; <b>SL:</b> ${s.sl ?? "—"} &nbsp;&nbsp; <b>TP1:</b> ${s.tp1 ?? "—"} ${tp2Html}</p>
          <p style="color:#888">Audience: ${s.audience?.toUpperCase() || "N/A"}</p>
        </div>`;

      // Chunked sends (avoid giant payloads)
      const emails: string[] = (subs ?? []).map((r: any) => r.email).filter(Boolean);
      const batchSize = 80;
      for (let i = 0; i < emails.length; i += batchSize) {
        const slice = emails.slice(i, i + batchSize);
        await sendEmail({ to: slice, subject, html });
        delivered += slice.length;
      }

      // 4) Mark signal as sent + insert deliveries rows
      await supabaseAdmin
        .from("signals")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", s.id);
      if (emails.length) {
        const ins = emails.map((e) => ({ signal_id: s.id, email: e, channel: "email", delivered_at: new Date().toISOString() }));
        await supabaseAdmin.from("deliveries").insert(ins);
      }
    }

    return NextResponse.json({ ok: true, signals_sent: signals?.length || 0, recipients: delivered });
  } catch (e: any) {
    console.error("[cron/hourly] error", e);
    return NextResponse.json({ ok: false, error: e?.message || "unknown" }, { status: 500 });
  }
}
