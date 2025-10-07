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
