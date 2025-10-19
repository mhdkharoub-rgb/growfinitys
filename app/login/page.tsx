"use client";

import { createSupabaseClient } from "@/lib/supabaseClient";
import { useState } from "react";

export default function Login() {
  const supabase = createSupabaseClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function sendMagic() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/dashboard` }
    });
    if (error) alert(error.message);
    else setSent(true);
  }

  return (
    <div>
      <h2>Login</h2>
      {sent ? (
        <p>Magic link sent. Check your email.</p>
      ) : (
        <>
          <input
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: 8, width: 260 }}
          />
          <button onClick={sendMagic} style={{ marginLeft: 8 }}>Send link</button>
        </>
      )}
    </div>
  );
}
