// middleware.js
import { NextResponse } from "next/server"

export function middleware(req) {
  const { pathname } = req.nextUrl
  const user = req.cookies.get("user")

  // List of protected routes
  const protectedRoutes = ["/dashboard"]

  // If trying to access a protected route without login
  if (protectedRoutes.includes(pathname) && !user) {
    const loginUrl = new URL("/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Allow everything else
  return NextResponse.next()
}

// Tell Next.js to run middleware on all routes
export const config = {
  matcher: ["/dashboard", "/api/:path*"],
}
