import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const nowIso = new Date().toISOString();

    const { data: signals, error: sigErr } = await supabaseAdmin
      .from("signals")
      .select("*")
      .eq("status", "queued")
      .lte("scheduled_at", nowIso)
      .limit(50);
    if (sigErr) throw sigErr;

    let delivered = 0;

    for (const signal of signals ?? []) {
      const { data: subs, error: subsErr } = await supabaseAdmin.rpc(
        "active_subscribers_for_audience",
        { p_audience: signal.audience }
      );
      if (subsErr) throw subsErr;

      const subject = `📈 ${signal.title || "New Signal"} — ${signal.symbol ?? signal.pair ?? ""}`;
      const html = `
        <div style="font-family:Inter,Arial,sans-serif;">
          <h2>Growfinitys Trading Signal</h2>
          <p><b>Market:</b> ${signal.symbol ?? signal.pair ?? "N/A"}</p>
          <p><b>Type:</b> ${signal.type ?? "N/A"} &nbsp;&nbsp; <b>Risk:</b> ${signal.risk ?? "—"}</p>
          <p><b>Entry:</b> ${signal.entry ?? "—"} &nbsp;&nbsp; <b>SL:</b> ${signal.sl ?? "—"} &nbsp;&nbsp; <b>TP1:</b> ${
            signal.tp1 ?? "—"
          } ${signal.tp2 ? "&nbsp;&nbsp;<b>TP2:</b> " + signal.tp2 : ""}</p>
          <p style="color:#888">Audience: ${signal.audience?.toUpperCase() || "N/A"}</p>
        </div>`;

      const emails: string[] = (subs ?? []).map((row: any) => row.email).filter(Boolean);
      const batchSize = 80;
      for (let i = 0; i < emails.length; i += batchSize) {
        const slice = emails.slice(i, i + batchSize);
        if (slice.length) {
          await sendEmail({ to: slice, subject, html });
          delivered += slice.length;
        }
      }

      await supabaseAdmin
        .from("signals")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", signal.id);

      if (emails.length) {
        const rows = emails.map((email) => ({
          signal_id: signal.id,
          email,
          channel: "email",
          delivered_at: new Date().toISOString(),
        }));
        await supabaseAdmin.from("deliveries").insert(rows);
      }
    }

    return NextResponse.json({ ok: true, signals_sent: signals?.length || 0, recipients: delivered });
  } catch (e: any) {
    console.error("[cron/hourly] error", e);
    return NextResponse.json({ ok: false, error: e?.message || "unknown" }, { status: 500 });
  }
}
