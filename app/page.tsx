export default function HomePage() {
  return (
    <main style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1 style={{ fontSize: 36, color: "#d4af37" }}>Growfinitys</h1>
      <p style={{ margin: "20px 0", fontSize: 18 }}>
        AI-Powered Business Content Hub — boost your sales & marketing with automation.
      </p>
      <a
        href="/login"
        style={{
          display: "inline-block",
          background: "#d4af37",
          color: "white",
          padding: "12px 28px",
          borderRadius: 6,
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Login as Admin
      </a>
    </main>
  );
}
