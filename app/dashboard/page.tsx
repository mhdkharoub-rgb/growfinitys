import { supabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = supabaseServer();
  const {
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
