import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const supabase = supabaseServer();

    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (memberError) throw memberError;

    if (!member) {
      return NextResponse.json(
        { success: false, error: "No active membership found" },
        { status: 404 }
      );
    }

    const nowIso = new Date().toISOString();
    const { data: subs, error: subsError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("member_id", member.id)
      .eq("status", "active")
      .gt("ends_at", nowIso);

    if (subsError) throw subsError;

    if (!subs?.length) {
      return NextResponse.json(
        { success: false, error: "Subscription not active" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Member validated successfully",
      tier: subs[0].plan ?? null,
      expires_at: subs[0].ends_at ?? null,
    });
  } catch (err) {
    console.error("\u274c Nas.io validate route error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
