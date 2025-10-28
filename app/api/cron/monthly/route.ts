import { NextResponse } from "next/server";

export async function GET() {
  // Extend later: compile monthly win-rate, churn, LTV, etc.
  return NextResponse.json({ ok: true, todo: "monthly analytics pending" });
}
