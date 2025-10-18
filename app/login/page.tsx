"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password: pass });
    if (error) alert(error.message); else location.href = "/dashboard";
  }

  return (
    <form onSubmit={onLogin} className="max-w-md space-y-3">
      <h2 className="text-xl font-semibold">Login</h2>
      <input className="border rounded px-3 py-2 w-full" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input className="border rounded px-3 py-2 w-full" value={pass} type="password" onChange={e=>setPass(e.target.value)} placeholder="Password" />
      <button className="border rounded px-3 py-2">Login</button>
    </form>
  );
}
