import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { notifyAdmin } from "@/lib/email";

export async function GET() {
  try {
    const now = new Date().toISOString();
    const { count: expired } = await supabaseAdmin
      .from("subscriptions")
      .update({ status: "expired" })
      .lt("ends_at", now)
      .neq("status", "expired")
      .select("*", { count: "exact", head: true });

    const { count: active } = await supabaseAdmin
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    const html = `<h2>Growfinitys — Daily Summary</h2><p>Active: ${active || 0}</p><p>Expired: ${expired || 0}</p>`;
    await notifyAdmin("Daily Summary", html);
    return NextResponse.json({ ok: true, active, expired });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message });
  }
}
