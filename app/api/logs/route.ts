import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { event, details } = await req.json();
    const { error } = await supabase
      .from("automation_logs")
      .insert([{ event, details, created_at: new Date().toISOString() }]);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Logging failed:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("automation_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return NextResponse.json({ logs: data });
  } catch (err) {
    console.error("Fetch logs failed:", err);
    return NextResponse.json({ logs: [], error: String(err) }, { status: 500 });
  }
}
