import { serialize } from "cookie"

export default function handler(req, res) {
  res.setHeader(
    "Set-Cookie",
    serialize("session_email", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/"
    })
  )

  res.status(200).json({ success: true, message: "Logged out" })
}
