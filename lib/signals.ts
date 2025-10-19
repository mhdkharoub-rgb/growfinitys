import { createSupabaseServer } from "./supabaseServer";

export async function generateSignals(timeframe: "hourly" | "daily" | "monthly") {
  // Placeholder AI logic — replace with your model/provider later
  const payload = {
    ts: new Date().toISOString(),
    timeframe,
    items: [
      { pair: "BTC/USD", direction: "long", price: 65200, confidence: 0.74 },
      { pair: "ETH/USD", direction: "short", price: 3120, confidence: 0.68 }
    ]
  };

  const supabase = createSupabaseServer();
  const { error } = await supabase
    .from("signals")
    .insert({ timeframe, data: payload });
  if (error) throw error;

  return payload;
}
