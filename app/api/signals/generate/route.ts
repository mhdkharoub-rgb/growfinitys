export const runtime = "nodejs";

import { requireCronSecret } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabaseServer";

function generateMock(period: "hourly"|"daily"|"monthly") {
  // Placeholder signal content (replace with your AI later)
  const picks = [
    "BTC momentum rising; consider buy zone.",
    "ETH consolidating; watch breakout levels.",
    "SOL strength vs market; staggered entries.",
    "Risk alert: tighten stops on alts.",
    "Macro: funding neutral, open interest steady."
  ];
  const msg = picks[Math.floor(Math.random()*picks.length)];
  return `[${period.toUpperCase()}] ${msg}`;
}

export async function POST(req: Request) {
  const unauthorized = requireCronSecret(req);
  if (unauthorized) return unauthorized;

  const period = (new URL(req.url).searchParams.get("period") || "hourly") as "hourly"|"daily"|"monthly";
  if (!["hourly","daily","monthly"].includes(period)) return new Response("Bad period", { status: 400 });

  const supabase = supabaseServer();
  const summary = generateMock(period);
  const { error } = await supabase.from("signals").insert({ period, summary });
  if (error) return new Response(error.message, { status: 500 });

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
}
