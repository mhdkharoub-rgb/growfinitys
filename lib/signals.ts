import { DateTime } from 'luxon';


export type Signal = {
kind: 'hourly' | 'daily' | 'monthly';
payload: any;
};


export function generateSignal(kind: Signal['kind']) {
// TODO: plug in your AI generation logic here
const now = DateTime.utc().toISO();
return {
kind,
payload: {
generated_at: now,
summary: `${kind} signal at ${now}`,
markets: [
{ symbol: 'BTC/USD', action: 'LONG', confidence: 0.62 },
{ symbol: 'ETH/USD', action: 'HOLD', confidence: 0.51 }
]
}
} as Signal;
}
