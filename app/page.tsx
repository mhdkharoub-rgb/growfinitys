import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 720, padding: "24px" }}>
        <h1
          style={{ fontSize: 36, fontWeight: 800, color: "#d4af37", marginBottom: 12 }}
        >
          Growfinitys
        </h1>
        <p style={{ opacity: 0.9, marginBottom: 24 }}>
          Premium AI signals and automation across Basic, Pro, and VIP tiers.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link
            href="/pricing"
            style={{
              padding: "10px 16px",
              border: "1px solid #2a2a2a",
              borderRadius: 8,
              textDecoration: "none",
              color: "#f5f5f5",
            }}
          >
            Pricing
          </Link>
          <Link
            href="/login"
            style={{
              padding: "10px 16px",
              border: "1px solid #d4af37",
              color: "#0b0b0b",
              background: "#d4af37",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
