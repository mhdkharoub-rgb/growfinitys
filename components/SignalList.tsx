import { supabaseServer } from '@/lib/supabaseServer';

export default async function SignalList() {
  const supabase = supabaseServer();
  if (!supabase) {
    return <div className="text-sm text-red-600">Supabase is not configured.</div>;
  }

  const { data, error } = await supabase
    .from('signals')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return <div className="text-sm text-red-600">Failed to load signals: {error.message}</div>;
  }

  return (
    <div className="space-y-3">
      {(data ?? []).map((s) => (
        <div key={s.id} className="p-4 border rounded">
          <div className="text-xs uppercase text-gray-500">{s.kind}</div>
          <pre className="text-sm overflow-auto">{JSON.stringify(s.payload, null, 2)}</pre>
          <div className="text-xs text-gray-400">{new Date(s.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
