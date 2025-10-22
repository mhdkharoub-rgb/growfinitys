import { NextResponse } from 'next/server';
import { generateSignal } from '@/lib/signals';
import { supabaseServer } from '@/lib/supabaseServer';
import { sendSignalEmail } from '@/lib/emails';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = supabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });
  }

  const sig = generateSignal('monthly');
  const { error } = await supabase.from('signals').insert(sig);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: subs } = await supabase
    .from('subscriptions')
    .select('profiles:profiles(email),expires_at,status')
    .eq('status', 'active');

  const recipients = (subs ?? [])
    .filter((s) => new Date(s.expires_at) > new Date())
    .map((s: any) => s.profiles?.email ?? s.email)
    .filter(Boolean) as string[];

  const html = `<h2>MONTHLY SIGNAL</h2><pre>${JSON.stringify(sig.payload, null, 2)}</pre>`;
  await Promise.all(recipients.map((e) => sendSignalEmail(e, 'New monthly signal', html)));

  return NextResponse.json({ ok: true });
}
