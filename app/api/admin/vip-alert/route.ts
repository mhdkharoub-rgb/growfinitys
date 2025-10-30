import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const url = process.env.ZAPIER_VIP_WEBHOOK_URL;
    if (!url) {
      return NextResponse.json(
        { ok: false, error: "ZAPIER_VIP_WEBHOOK_URL is not configured" },
        { status: 500 }
      );
    }

    const payload = await req.json().catch(() => ({}));
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      body: text,
    });
  } catch (error: any) {
    console.error("[vip-alert] failed", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "unknown error" },
      { status: 500 }
    );
  }
}
