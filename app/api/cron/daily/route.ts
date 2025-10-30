import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const nowIso = new Date().toISOString();

    // Select expiring subscriptions
    const { data: expiring, error: expErr } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact" }) // ✅ fixed (single-argument form)
      .lt("ends_at", nowIso)
      .neq("status", "expired");

    if (expErr) throw expErr;

    // Example summaries (extend as needed)
    const [active, queued, sent] = await Promise.all([
      supabase.from("signals").select("*").eq("status", "active"),
      supabase.from("signals").select("*").eq("status", "queued"),
      supabase.from("signals").select("*").eq("status", "sent"),
    ]);

    const summary = {
      expiredCount: expiring?.length ?? 0,
      active: active.data?.length ?? 0,
      queued: queued.data?.length ?? 0,
      sent: sent.data?.length ?? 0,
      timestamp: nowIso,
    };

    console.log("Daily summary:", summary);

    return NextResponse.json({ success: true, summary });
  } catch (err) {
    console.error("❌ Daily cron failed:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
