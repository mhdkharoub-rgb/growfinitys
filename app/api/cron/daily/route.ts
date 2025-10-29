import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { notifyAdmin } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const nowIso = new Date().toISOString();

    const { count: expiringCount, error: expErr } = await supabaseAdmin
      .from("subscriptions")
      .update({ status: "expired" })
      .lt("ends_at", nowIso)
      .neq("status", "expired")
      .select("*", { count: "exact", head: true });
    if (expErr) throw expErr;

    const [activeResp, queuedResp, sentResp] = await Promise.all([
      supabaseAdmin
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabaseAdmin
        .from("signals")
        .select("id", { count: "exact", head: true })
        .eq("status", "queued"),
      supabaseAdmin
        .from("signals")
        .select("id", { count: "exact", head: true })
        .gte("sent_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    ]);

    const activeCount = activeResp.count ?? 0;
    const queuedCount = queuedResp.count ?? 0;
    const sent24Count = sentResp.count ?? 0;

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;">
        <h2>Growfinitys — Daily Automation Summary</h2>
        <p><b>Active subscriptions:</b> ${activeCount}</p>
        <p><b>Expired today:</b> ${expiringCount || 0}</p>
        <p><b>Signals queued:</b> ${queuedCount}</p>
        <p><b>Signals sent (last 24h):</b> ${sent24Count}</p>
        <p style="color:#888">Time: ${nowIso}</p>
      </div>`;

    await notifyAdmin("Growfinitys — Daily Summary", html);
    return NextResponse.json({ ok: true, expired: expiringCount || 0, active: activeCount });
  } catch (e: any) {
    console.error("[cron/daily] error", e);
    return NextResponse.json({ ok: false, error: e?.message || "unknown" }, { status: 500 });
  }
}
