"use client";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) router.push("/login");
      else setUser(data.user);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome {user?.email}</p>
      <button
        onClick={() => router.push("/dashboard")}
        style={{ margin: "20px", padding: "10px 20px", borderRadius: 6 }}
      >
        Go to VIP Dashboard
      </button>
      <button
        onClick={handleLogout}
        style={{
          background: "#d4af37",
          color: "white",
          padding: "10px 24px",
          borderRadius: 6,
          border: "none",
        }}
      >
        Logout
      </button>
    </main>
  );
}
