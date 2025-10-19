import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { generateSignals } from "@/lib/signals";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { timeframe } = await request.json();
  if (!["hourly", "daily", "monthly"].includes(timeframe)) {
    return NextResponse.json({ error: "Invalid timeframe" }, { status: 400 });
  }

  const data = await generateSignals(timeframe as "hourly" | "daily" | "monthly");
  return NextResponse.json({ ok: true, data });
}
