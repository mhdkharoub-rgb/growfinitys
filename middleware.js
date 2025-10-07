diff --git a/middleware.js b/middleware.js
new file mode 100644
index 0000000..abcdef1
--- /dev/null
+++ middleware.js
@@ -0,0 +1,27 @@
+import { NextResponse } from "next/server"
+import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
+
+export async function middleware(req) {
+  const res = NextResponse.next()
+  const supabase = createMiddlewareClient({ req, res })
+
+  const {
+    data: { session },
+  } = await supabase.auth.getSession()
+
+  const protectedRoutes = ["/dashboard", "/admin"]
+  if (
+    protectedRoutes.some((p) => req.nextUrl.pathname.startsWith(p)) &&
+    !session
+  ) {
+    const loginUrl = new URL("/login", req.url)
+    loginUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
+    return NextResponse.redirect(loginUrl)
+  }
+
+  return res
+}
+
+export const config = {
+  matcher: ["/dashboard/:path*", "/admin/:path*"],
+}
