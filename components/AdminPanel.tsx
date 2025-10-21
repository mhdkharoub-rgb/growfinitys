'use client';
import { useState } from 'react';


export default function AdminPanel() {
const [busy, setBusy] = useState(false);
const [result, setResult] = useState<string | null>(null);


async function trigger(kind: 'hourly'|'daily'|'monthly') {
setBusy(true);
setResult(null);
try {
const res = await fetch(`/api/signals/generate?kind=${kind}`, { method: 'POST' });
const json = await res.json();
setResult(JSON.stringify(json, null, 2));
} finally {
setBusy(false);
}
}


return (
<div className="space-y-4">
<div className="flex gap-2">
<button onClick={() => trigger('hourly')} disabled={busy} className="px-3 py-2 border rounded">Generate Hourly</button>
<button onClick={() => trigger('daily')} disabled={busy} className="px-3 py-2 border rounded">Generate Daily</button>
<button onClick={() => trigger('monthly')} disabled={busy} className="px-3 py-2 border rounded">Generate Monthly</button>
</div>
{result && (
<pre className="p-3 bg-gray-50 border rounded text-sm overflow-auto">{result}</pre>
)}
</div>
);
}
