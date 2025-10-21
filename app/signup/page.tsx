'use client';
import { supabaseClient } from '@/lib/supabaseClient';
import { useState } from 'react';


export default function Signup() {
const supabase = supabaseClient();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [msg, setMsg] = useState<string | null>(null);


async function onSignup(e: React.FormEvent) {
e.preventDefault();
const { error } = await supabase.auth.signUp({ email, password });
setMsg(error ? error.message : 'Account created! Check your email to confirm.');
if (!error) window.location.href = '/dashboard';
}


return (
<form onSubmit={onSignup} className="max-w-md space-y-3">
<h1 className="text-xl font-semibold">Sign Up</h1>
<input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<input className="w-full border p-2 rounded" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
<button className="px-4 py-2 border rounded">Create account</button>
{msg && <div className="text-sm text-gray-600">{msg}</div>}
</form>
);
}
