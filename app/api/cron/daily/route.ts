import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn("[cron/daily] Missing Supabase configuration");
    return null;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET() {
  const supabase = getClient();
  if (!supabase) {
    return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const nowIso = new Date().toISOString();

    const { data: expiring, error: expErr } = await supabase
      .from("subscriptions")
      .select("*")
      .lt("ends_at", nowIso)
      .neq("status", "expired");

    if (expErr) throw expErr;

    const [active, queued, sent] = await Promise.all([
      supabase.from("subscriptions").select("id", { count: "exact" }).eq("status", "active"),
      supabase.from("signals").select("id", { count: "exact" }).eq("status", "queued"),
      supabase.from("signals").select("id", { count: "exact" }).eq("status", "sent"),
    ]);

    const summary = {
      expiredCount: expiring?.length ?? 0,
      active: active.count ?? 0,
      queued: queued.count ?? 0,
      sent: sent.count ?? 0,
      timestamp: nowIso,
    };

    console.log("Daily summary:", summary);

    return NextResponse.json({ success: true, summary });
  } catch (err) {
    console.error("❌ Daily cron failed:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
