// pages/api/auth/logout.js
import cookie from "cookie";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("session_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // immediately expire
      sameSite: "strict",
      path: "/",
    })
  );

  return res.status(200).json({ success: true, message: "Logged out successfully" });
}
