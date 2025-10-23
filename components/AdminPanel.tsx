'use client';

import { useState } from 'react';

type SignalKind = 'hourly' | 'daily' | 'monthly';

export default function AdminPanel() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function trigger(kind: SignalKind) {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch(`/api/signals/generate?kind=${kind}`, {
        method: 'POST',
      });
      const json = await res.json();
      setResult(JSON.stringify(json, null, 2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-gold/20 bg-black/40 p-6 shadow-lg shadow-gold/10">
      <div className="flex flex-wrap gap-3">
        {(['hourly', 'daily', 'monthly'] as SignalKind[]).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => trigger(kind)}
            disabled={busy}
            className="rounded-lg border border-gold px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            Generate {kind.charAt(0).toUpperCase() + kind.slice(1)}
          </button>
        ))}
      </div>
      {result && (
        <pre className="max-h-64 overflow-auto rounded-lg border border-gold/30 bg-black/60 p-4 text-xs leading-relaxed text-gold">
          {result}
        </pre>
      )}
    </div>
  );
}
