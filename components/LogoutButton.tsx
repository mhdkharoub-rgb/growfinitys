"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LogoutButton() {
  const supabase = createClientComponentClient();
  return (
    <button
      onClick={() => supabase.auth.signOut().then(() => (window.location.href = "/login"))}
      style={{ marginTop: "20px", padding: "8px 16px", background: "#333", color: "#fff", borderRadius: "6px" }}
    >
      Logout
    </button>
  );
}
