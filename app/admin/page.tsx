"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.email !== "mhdkharoub@gmail.com") {
        router.replace("/dashboard");
      }
    });
  }, []);

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "16px", color: "#FFD87A" }}>Admin Dashboard</h1>
      <p>Welcome, Mohammad. Manage platform users, pricing, and content here.</p>
    </div>
  );
}
