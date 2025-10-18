export default function SignalList({ signals }: { signals: { created_at: string; period: string; summary: string }[] }) {
  if (!signals?.length) return <p>No signals yet.</p>;
  return (
    <ul className="space-y-3">
      {signals.map((s, i) => (
        <li key={i} className="border rounded p-3">
          <div className="text-xs text-gray-500">{new Date(s.created_at).toLocaleString()} • {s.period}</div>
          <div className="mt-1">{s.summary}</div>
        </li>
      ))}
    </ul>
  );
}
