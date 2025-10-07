diff --git a/components/Navbar.js b/components/Navbar.js
index 123abcd..456efgh 100644
--- a/components/Navbar.js
+++ b/components/Navbar.js
@@ -1,6 +1,7 @@
 import { useEffect, useState } from "react"
 import Link from "next/link"
 import { supabase } from "../lib/supabase"
+import LogoutButton from "./LogoutButton"
 import { useRouter } from "next/router"
 
 export default function Navbar() {
@@ -10,18 +11,38 @@ export default function Navbar() {
   useEffect(() => {
     const getSession = async () => {
       const { data } = await supabase.auth.getSession()
+      setSession(data.session)
       setLoading(false)
     }
@@ -35,12 +36,26 @@ return (
         <div className="hidden md:flex space-x-8 text-sm font-semibold">
           <a href="#features" className="hover:text-yellow-400 transition">Features</a>
           <a href="#pricing" className="hover:text-yellow-400 transition">Pricing</a>
           <a href="#how" className="hover:text-yellow-400 transition">How It Works</a>
         </div>
 
-        {/* Sign Up / Login Buttons */}
-        <div className="flex items-center space-x-4">
-          {!session ? (
-            <>
-              <Link href="/login" className="…">Login</Link>
-              <Link href="/signup" className="…">Sign Up</Link>
-            </>
-          ) : (
-            <>
-              <Link href="/dashboard" className="…">Dashboard</Link>
-              <button onClick={handleLogout} className="…">Logout</button>
-            </>
-          )}
-        </div>
+        {/* Dynamic Buttons */}
+        {!loading && (
+          <div className="flex items-center space-x-4">
+            {session ? (
+              <>
+                <Link
+                  href="/dashboard"
+                  className="border border-yellow-500 text-yellow-500 font-semibold py-2 px-5 rounded-lg hover:bg-yellow-500 hover:text-black transition"
+                >
+                  Dashboard
+                </Link>
+                <LogoutButton />
+              </>
+            ) : (
+              <>
+                <Link
+                  href="/login"
+                  className="border border-yellow-500 text-yellow-500 font-semibold py-2 px-5 rounded-lg hover:bg-yellow-500 hover:text-black transition"
+                >
+                  Login
+                </Link>
+                <Link
+                  href="/signup"
+                  className="bg-yellow-500 text-black font-semibold py-2 px-5 rounded-lg hover:bg-yellow-400 transition"
+                >
+                  Sign Up
+                </Link>
+              </>
+            )}
+          </div>
+        )}
       </div>
     </nav>
   )
}
