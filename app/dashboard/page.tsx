import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main style={{ maxWidth: 720, margin: "48px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, color: "#d4af37", marginBottom: 8 }}>
        Growfinitys VIP Dashboard
      </h1>
      <p style={{ opacity: 0.85, marginBottom: 24 }}>
        You’re logged in. Exclusive signals and automation tools will appear here soon.
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        <form action="/api/auth/logout" method="post">
          <button style={btn()}>Log out</button>
        </form>
      </div>
    data: { user },
  } = await supabase.auth.getUser();

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

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ color: "#d4af37", fontSize: 28, fontWeight: 800 }}>VIP Dashboard</h1>
      <p style={{ opacity: 0.9, marginTop: 6 }}>You’re logged in as {user.email}</p>

      <form action="/api/auth/logout" method="post" style={{ marginTop: 16 }}>
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
    </main>
  );
}

function btn() {
  return {
    background: "#d4af37",
    color: "#0a0a0a",
    padding: "10px 16px",
    borderRadius: 8,
    border: "1px solid #d4af37",
    cursor: "pointer",
  } satisfies CSSProperties;
}
