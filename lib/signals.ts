export type Audience = "basic" | "pro" | "vip";

export type GeneratedSignal = {
  title: string;
  symbol: string;
  type: "LONG" | "SHORT";
  entry: string;
  sl: string;
  tp1: string;
  tp2?: string | null;
  risk: "low" | "med" | "high";
  audience: Audience;
  scheduled_at: string;
  status: "queued";
};

const SYMBOLS: Record<Audience, string[]> = {
  basic: ["EURUSD", "BTCUSDT", "GBPUSD", "ETHUSDT"],
  pro: ["XAUUSD", "US100", "SOLUSDT", "USDJPY", "AUDUSD"],
  vip: ["BTCUSD", "ETHUSD", "SPX500", "NAS100", "USDCAD", "GBPJPY"],
};

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomPrice(): number {
  return Math.round((Math.random() * 1000 + 10) * 100) / 100;
}

function buildTitle(symbol: string, direction: "LONG" | "SHORT"): string {
  const sentiment = direction === "LONG" ? "Bullish" : "Bearish";
  return `${symbol} ${sentiment} Setup`;
}

export async function generateSignal(audience: Audience): Promise<GeneratedSignal> {
  const direction = Math.random() > 0.5 ? "LONG" : "SHORT";
  const symbol = pick(SYMBOLS[audience]);
  const entry = randomPrice();
  const sl = direction === "LONG" ? entry - Math.random() * 15 : entry + Math.random() * 15;
  const tp1 = direction === "LONG" ? entry + Math.random() * 25 : entry - Math.random() * 25;
  const tp2 = direction === "LONG" ? tp1 + Math.random() * 20 : tp1 - Math.random() * 20;

  const nowIso = new Date().toISOString();
  return {
    title: buildTitle(symbol, direction),
    symbol,
    type: direction,
    entry: entry.toFixed(2),
    sl: sl.toFixed(2),
    tp1: tp1.toFixed(2),
    tp2: tp2.toFixed(2),
    risk: audience === "vip" ? "low" : audience === "pro" ? "med" : "high",
    audience,
    scheduled_at: nowIso,
    status: "queued",
  };
}
