import { NextResponse } from "next/server";

export async function POST() {
  try {
    const url = process.env.ZAPIER_PRO_WEBHOOK_URL;
    if (!url) throw new Error("Missing ZAPIER_PRO_WEBHOOK_URL");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pro",
        message: "⚡ Pro signal broadcast triggered from Growfinitys Admin",
      }),
    });
    return NextResponse.json({ ok: res.ok });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
