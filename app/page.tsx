export default function Home() {
  return (
    <main style={{ padding: "80px", textAlign: "center" }}>
      <h1>Welcome to Growfinitys</h1>
      <p>Your AI-powered signal automation & growth platform.</p>
      <a
        href="/login"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "12px 22px",
          background: "black",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Login
      </a>
    </main>
  );
}
