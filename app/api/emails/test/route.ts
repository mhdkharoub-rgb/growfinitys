import { NextRequest, NextResponse } from 'next/server';
import { sendSignalEmail } from '@/lib/emails';


export async function POST(req: NextRequest) {
const { to } = await req.json();
if (!to) return NextResponse.json({ error: 'to required' }, { status: 400 });
await sendSignalEmail(to, 'Growfinitys Test', '<p>Hello from Growfinitys</p>');
return NextResponse.json({ ok: true });
}
