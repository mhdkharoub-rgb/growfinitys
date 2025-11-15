import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const adminEmail =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "";

  let isAdmin = false;

  if (session.user.email && adminEmail) {
    isAdmin = session.user.email.toLowerCase() === adminEmail.toLowerCase();
  }

  if (!isAdmin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();
    if (profile?.role === "admin") isAdmin = true;
  }

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <main style={{ maxWidth: 960, margin: "48px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, color: "#d4af37", marginBottom: 8 }}>
        Admin Dashboard
      </h1>
      <p style={{ opacity: 0.85, marginBottom: 24 }}>
        Welcome, {session.user.email}. Use the controls below to manage VIP alerts and automations.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <form action="/api/auth/logout" method="post">
          <button style={btn()}>Log out</button>
        </form>
        <a href="/dashboard" style={btn("ghost")}>
          Go to VIP Dashboard
        </a>
      </div>
    </main>
  );
}

function btn(variant: "solid" | "ghost" = "solid") {
  if (variant === "solid") {
    return {
      background: "#d4af37",
      color: "#0a0a0a",
      padding: "10px 16px",
      borderRadius: 8,
      border: "1px solid #d4af37",
      textDecoration: "none",
      display: "inline-block",
    } satisfies CSSProperties;
  }
  return {
    background: "transparent",
    color: "#f5f5f5",
    padding: "10px 16px",
    borderRadius: 8,
    border: "1px solid #333",
    textDecoration: "none",
    display: "inline-block",
  } satisfies CSSProperties;
}
