"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_e, s) => setEmail(s?.user?.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <nav className="border-b">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/">Growfinitys</Link>
        <div className="flex gap-4">
          <Link href="/pricing">Pricing</Link>
          {email ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <button onClick={() => supabaseBrowser.auth.signOut().then(() => location.reload())}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
