"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";

export default function Navbar() {
  const supabase = createSupabaseClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    location.href = "/";
  }

  return (
    <header style={{ borderBottom: "1px solid #eee", padding: 12 }}>
      <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link href="/">Home</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/dashboard">Dashboard</Link>
        {email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? <Link href="/admin">Admin</Link> : null}
        <div style={{ marginLeft: "auto" }}>
          {email ? (
            <>
              <span style={{ marginRight: 8 }}>{email}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <span> · </span>
              <Link href="/signup">Signup</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
