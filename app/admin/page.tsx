import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";

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
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();

  if (!user) {
    return (
      <main style={{ minHeight: "60dvh", display: "grid", placeItems: "center" }}>
        <div>
          <p>Not authorized.</p>
          <p>
            <Link href="/login" style={{ color: "#d4af37" }}>
              Go to Login
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const isOwner = adminEmail && user.email?.toLowerCase() === adminEmail;

  if (!isOwner) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return (
        <main style={{ minHeight: "60dvh", display: "grid", placeItems: "center" }}>
          <div>
            <p>Admins only.</p>
            <p>
              <Link href="/dashboard" style={{ color: "#d4af37" }}>
                Go to Dashboard
              </Link>
            </p>
          </div>
        </main>
      );
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ color: "#d4af37", fontSize: 28, fontWeight: 800 }}>Admin Console</h1>
      <p style={{ opacity: 0.9, marginTop: 6 }}>Welcome, {user.email}</p>

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #2a2a2a",
              background: "#1a1a1a",
              color: "#f5f5f5",
            }}
          >
            Logout
          </button>
        </form>
        <Link
          href="/dashboard"
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #2a2a2a",
            background: "#1a1a1a",
            color: "#f5f5f5",
            textDecoration: "none",
          }}
        >
          Member Dashboard
        </Link>
      </div>

      <div style={{ marginTop: 24, padding: 16, border: "1px solid #2a2a2a", borderRadius: 8 }}>
        <h3 style={{ marginTop: 0, color: "#d4af37" }}>Quick Actions</h3>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Trigger VIP/Pro/Basic signal zaps (wire here later)</li>
          <li>Review subscriptions</li>
          <li>Send broadcasts</li>
        </ul>
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
