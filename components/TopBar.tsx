"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        console.error("Failed to load user", error);
        return;
      }
      if (!isMounted) return;
      const userEmail = data?.user?.email ?? null;
      setEmail(userEmail);
    });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <header className="w-full bg-black text-[#d4af37] flex justify-between items-center px-6 py-3 shadow-md">
      <h1 className="text-xl font-bold tracking-wide">🌟 Growfinitys</h1>
      <div className="flex items-center gap-4 text-sm">
        {email ? (
          <>
            <span>
              Signed in as <b>{email}</b>
            </span>
            <button
              onClick={handleLogout}
              className="border border-[#d4af37] px-3 py-1 rounded hover:bg-[#d4af37] hover:text-black transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => router.replace("/login")}
            className="border border-[#d4af37] px-3 py-1 rounded hover:bg-[#d4af37] hover:text-black transition"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
