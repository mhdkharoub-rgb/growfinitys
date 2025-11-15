import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { supabaseServer } from "@/lib/supabaseServer";

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
