import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function POST() {
  await requireAdmin();

  const url = process.env.ZAPIER_VIP_WEBHOOK_URL;
  if (!url) {
    return NextResponse.json({ error: "Missing ZAPIER_VIP_WEBHOOK_URL" }, { status: 500 });
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audience: "vip", count: 12 }),
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json({ error: "Zap failed", detail: text }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
