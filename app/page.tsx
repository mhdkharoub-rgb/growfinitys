export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "sans-serif",
        background: "#111",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "16px", fontWeight: "700" }}>
        Welcome to Growfinitys
      </h1>

      <a
        href="/login"
        style={{
          background: "gold",
          color: "#111",
          padding: "14px 28px",
          borderRadius: "8px",
          fontWeight: "600",
          textDecoration: "none",
        }}
      >
        Login as Admin
      </a>
    </div>
  );
}
