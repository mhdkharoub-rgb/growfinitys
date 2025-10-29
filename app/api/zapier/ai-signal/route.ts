import { NextRequest, NextResponse } from "next/server";
import { requireZapierAuth } from "@/lib/auth";
import { callOpenAI } from "@/lib/llm";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { tierPrompts } from "@/lib/signalPrompts";
import { sendEmail } from "@/lib/email";

type Audience = keyof typeof tierPrompts;

type SignalGenerationPayload = {
  audience?: Audience;
  count?: number;
  markets?: string[];
  sendNow?: boolean;
};

type GeneratedSignal = {
  title?: string;
  symbol?: string;
  type?: string;
  entry?: string | number;
  sl?: string | number;
  tp1?: string | number;
  tp2?: string | number | null;
  risk?: string;
  reasoning?: string;
};

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const unauthenticated = requireZapierAuth(req);
  if (unauthenticated) return unauthenticated;

  try {
    const body = ((await req.json().catch(() => ({}))) || {}) as SignalGenerationPayload;

    const audience = (body.audience ?? "basic") as Audience;
    const requestedCount = body.count ?? 3;
    const count = Math.max(1, Math.min(10, requestedCount));
    const markets = Array.isArray(body.markets) ? body.markets.filter(Boolean).slice(0, 12) : [];
    const sendNow = Boolean(body.sendNow);

    const tierInstructions = tierPrompts[audience] ?? tierPrompts.basic;
    const marketLine = markets.length
      ? `Prioritize these markets when relevant: ${markets.join(", ")}.`
      : "Choose the most compelling forex or crypto pairs for the tier.";

    const systemPrompt =
      "You are Growfinitys institutional-grade strategist. Always respond with strict JSON that matches the requested schema.";
    const userPrompt = `
${tierInstructions.trim()}

${marketLine}

Return ONLY valid JSON with the structure:
{
  "signals": [
    {
      "title": "string",
      "symbol": "PAIR",
      "type": "LONG" | "SHORT",
      "entry": "value",
      "sl": "value",
      "tp1": "value",
      "tp2": "value or null",
      "risk": "low" | "med" | "high",
      "reasoning": "short justification"
    }
  ]
}

Generate exactly ${count} signals. Use strings for numeric values so they can be rendered directly in emails.
`;

    const data = await callOpenAI([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    const signals = Array.isArray((data as any)?.signals) ? ((data as any).signals as GeneratedSignal[]) : [];
    if (!signals.length) {
      return NextResponse.json({ ok: false, error: "no_signals_generated" }, { status: 400 });
    }

    const scheduledAt = new Date().toISOString();

    const rows = signals.slice(0, count).map((signal) => {
      const symbol = String(signal.symbol ?? "").toUpperCase();
      const type = String(signal.type ?? "").toUpperCase();
      const risk = String(signal.risk ?? "med").toLowerCase();

      return {
        title: String(signal.title ?? `${symbol || "Unknown"} ${type || "Signal"}`),
        symbol,
        type,
        entry: String(signal.entry ?? ""),
        sl: String(signal.sl ?? ""),
        tp1: String(signal.tp1 ?? ""),
        tp2: signal.tp2 != null && signal.tp2 !== "" ? String(signal.tp2) : null,
        risk,
        audience,
        status: "queued" as const,
        scheduled_at: scheduledAt,
        content: JSON.stringify(signal),
      };
    });

    const filteredRows = rows.filter((row) => row.symbol && row.type && row.entry && row.sl && row.tp1);
    if (!filteredRows.length) {
      return NextResponse.json({ ok: false, error: "invalid_signal_payload" }, { status: 422 });
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("signals")
      .insert(filteredRows)
      .select("id, title, audience");

    if (error) throw error;

    let emailed = 0;
    if (sendNow) {
      const { data: subscribers, error: rpcError } = await supabaseAdmin.rpc("active_subscribers_for_audience", {
        p_audience: audience,
      });
      if (rpcError) throw rpcError;

      const emails: string[] = (subscribers ?? []).map((row: any) => row.email).filter(Boolean);

      if (emails.length) {
        const htmlSignals = filteredRows
          .map((row) => {
            const parsed = safeParseContent(row.content);
            const reasoning = parsed?.reasoning ? `<p style="margin:4px 0 0;color:#d4af37;">${parsed.reasoning}</p>` : "";
            return `
              <li style="margin-bottom:12px;">
                <div style="font-weight:600;color:#d4af37;">${row.title}</div>
                <div style="color:#f5f5f5;">${row.symbol} · ${row.type} · Risk: ${row.risk}</div>
                <div style="color:#f5f5f5;">Entry: ${row.entry} · SL: ${row.sl} · TP1: ${row.tp1}$
{row.tp2 ? ` · TP2: ${row.tp2}` : ""}</div>
                ${reasoning}
              </li>`;
          })
          .join("");

        const html = `
          <div style="font-family:Inter,Arial,sans-serif;background:#050505;padding:24px;color:#f5f5f5;">
            <h2 style="color:#d4af37;margin-bottom:12px;">Growfinitys Signals (${audience.toUpperCase()})</h2>
            <ul style="list-style:none;padding:0;margin:0;">${htmlSignals}</ul>
          </div>`;

        await sendEmail({
          to: emails,
          subject: `📈 ${filteredRows.length} new ${audience.toUpperCase()} signals`,
          html,
        });
        emailed = emails.length;
      }
    }

    return NextResponse.json({
      ok: true,
      inserted: inserted?.length ?? filteredRows.length,
      emailed,
      tier: audience,
    });
  } catch (error: any) {
    console.error("[/api/zapier/ai-signal] error", error);
    return NextResponse.json({ ok: false, error: error?.message || "unknown" }, { status: 500 });
  }
}

function safeParseContent(content: string | undefined | null): GeneratedSignal | null {
  if (!content) return null;
  try {
    return JSON.parse(content) as GeneratedSignal;
  } catch (error) {
    console.warn("[ai-signal] Failed to parse stored content", error);
    return null;
  }
}
