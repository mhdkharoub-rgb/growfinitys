import { NextResponse } from "next/server";
import { generateSignals } from "@/lib/signals";

export async function GET() {
  // optional: protect with a CRON_SECRET if you want
  const data = await generateSignals("hourly"); // or "daily" / "monthly" depending on file
  return NextResponse.json({ ok: true, data });
}
