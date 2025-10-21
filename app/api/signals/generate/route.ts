import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { generateSignal } from '@/lib/signals';
import { supabaseServer } from '@/lib/supabaseServer';
import { sendSignalEmail } from '@/lib/emails';


export async function POST(req: NextRequest) {
const admin = await requireAdmin();
if (!admin) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });


const kind = (new URL(req.url).searchParams.get('kind') ?? 'hourly') as 'hourly'|'daily'|'monthly';
const sig = generateSignal(kind);


const supabase = supabaseServer();
const { data, error } = await supabase.from('signals').insert(sig).select('*').single();
if (error) return NextResponse.json({ error: error.message }, { status: 500 });


// Email to all active subscribers
const { data: subs } = await supabase
.from('subscriptions')
.select('user_id,expires_at,status,plan,profiles:profiles(email)')
.eq('status','active');


const recipients = (subs ?? [])
.filter(s => new Date(s.expires_at) > new Date())
.map(s => s.profiles?.email)
.filter(Boolean) as string[];


const html = `<h2>${kind.toUpperCase()} SIGNAL</h2><pre>${JSON.stringify(sig.payload, null, 2)}</pre>`;
await Promise.all(recipients.map(e => sendSignalEmail(e, `New ${kind} signal`, html)));


return NextResponse.json({ ok: true, data });
}
