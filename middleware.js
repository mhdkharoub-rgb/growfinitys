// middleware.js
import { NextResponse } from "next/server"

export function middleware(req) {
  const url = req.nextUrl
  const token = req.cookies.get("nasio_session")

  // Protect only API routes
  if (url.pathname.startsWith("/api/")) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized: Login required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }
  }

  return NextResponse.next()
}
