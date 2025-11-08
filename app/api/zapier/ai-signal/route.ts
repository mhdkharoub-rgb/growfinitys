import { NextResponse } from "next/server";

type RequestBody = {
  audience?: string;
  count?: number;
};

type SignalRow = {
  title: string;
  symbol: string;
  type: string;
  risk: string;
  entry: string;
  sl: string;
  tp1: string;
  tp2?: string;
  reasoning: string;
};

export async function POST(req: Request) {
  try {
    const body = ((await req.json().catch(() => ({}))) || {}) as RequestBody;
    const audience = typeof body.audience === "string" ? body.audience : "basic";
    const rawCount = typeof body.count === "number" ? body.count : Number(body.count);
    const count = Number.isFinite(rawCount) && rawCount ? Math.max(1, Math.floor(rawCount)) : 3;

    const signals: SignalRow[] = Array.from({ length: count }).map((_, index) => ({
      title: `AI Signal ${index + 1}`,
      symbol: "BTC/USD",
      type: "BUY",
      risk: "Medium",
      entry: "43500",
      sl: "43000",
      tp1: "44000",
      tp2: "44500",
      reasoning: "AI pattern detected bullish setup.",
    }));

    const htmlList = signals
      .map(
        (signal) => `
          <li style="margin-bottom:16px;">
            <div style="font-weight:600;color:#d4af37;">${signal.title}</div>
            <div style="color:#f5f5f5;">
              ${signal.symbol} | ${signal.type} | Risk: ${signal.risk}
            </div>
            <div style="color:#f5f5f5;">
              Entry: ${signal.entry} | SL: ${signal.sl} | TP1: ${signal.tp1}${
                signal.tp2 ? ` | TP2: ${signal.tp2}` : ""
              }
            </div>
            <div style="color:#bbb;">${signal.reasoning}</div>
          </li>`
      )
      .join("");

    const html = `
      <html>
        <body style="background:#000;color:#f5f5f5;font-family:sans-serif;">
          <h2 style="color:#d4af37;">🚀 ${audience.toUpperCase()} AI Signals (${count})</h2>
          <ul style="list-style:none;padding:0;margin:0;">${htmlList}</ul>
        </body>
      </html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("[/api/zapier/ai-signal] error", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
