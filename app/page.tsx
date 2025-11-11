"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const email = session.session.user.email;
      if (!email) return;

      // Determine role
      if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setRole("admin");
      } else {
        setRole("vip");
      }
    };

    getUser();
  }, []);

  return (
    <div style={{ textAlign: "center", paddingTop: "80px" }}>
      <h1>Welcome to Growfinitys</h1>
      <p>Your AI Business Content & VIP Growth Platform</p>

      {!role && (
        <Link href="/login">
          <button>Login</button>
        </Link>
      )}

      {role === "admin" && (
        <>
          <Link href="/admin">
            <button style={{ marginRight: "12px" }}>Go to Admin Dashboard</button>
          </Link>
          <Link href="/dashboard">
            <button>Go to VIP Dashboard</button>
          </Link>
        </>
      )}

      {role === "vip" && (
        <Link href="/dashboard">
          <button>Enter VIP Dashboard</button>
        </Link>
      )}
    </div>
  );
}
