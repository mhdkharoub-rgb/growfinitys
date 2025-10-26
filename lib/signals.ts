import { DateTime } from 'luxon';

export type Signal = {
  kind: 'hourly' | 'daily' | 'monthly';
  payload: Record<string, unknown>;
};

export function generateSignal(kind: Signal['kind']): Signal {
  // TODO: plug in your AI generation logic here.
  const now = DateTime.utc().toISO();

  return {
    kind,
    payload: {
      generated_at: now,
      summary: `${kind} signal at ${now}`,
      markets: [
        { symbol: 'BTC/USD', action: 'LONG', confidence: 0.62 },
        { symbol: 'ETH/USD', action: 'HOLD', confidence: 0.51 },
      ],
    },
  };
}
