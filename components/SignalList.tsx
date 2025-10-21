import { supabaseServer } from '@/lib/supabaseServer';


export default async function SignalList() {
const supabase = supabaseServer();
const { data } = await supabase
.from('signals')
.select('*')
.order('created_at', { ascending: false })
.limit(20);


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
