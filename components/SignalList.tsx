export default function SignalList({ signals }: { signals: any[] }) {
  if (!signals?.length) return <p>No signals yet.</p>;
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {signals.map(s => (
        <div key={s.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
          <div><b>{s.timeframe}</b> · {new Date(s.created_at).toLocaleString()}</div>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{JSON.stringify(s.data, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
