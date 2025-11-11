"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session?.user) router.replace("/login");
    });
  }, []);

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "16px", color: "#FFD87A" }}>VIP Dashboard</h1>
      <p>Exclusive content, AI growth signals, and automations coming soon.</p>
    </div>
  );
}
