// lib/nasMembership.js
export async function getNasMembership(email) {
  try {
    // Call Nas.io Zero-link public API (replace URL with your community endpoint)
    const res = await fetch(`https://nas.io/api/v1/members/${email}`, {
      headers: {
        Authorization: `Bearer ${process.env.NASIO_API_KEY}`, // optional if private API
      },
    });

    if (!res.ok) return null;
    const data = await res.json();

    // Simplify to show tier only
    if (data?.membership_tier)
      return data.membership_tier; // e.g. "Pro", "VIP", "Basic"
    return null;
  } catch (err) {
    console.error("❌ Nas.io verification failed:", err);
    return null;
  }
}
