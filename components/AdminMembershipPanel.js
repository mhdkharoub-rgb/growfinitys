diff --git a/components/AdminMembershipPanel.js b/components/AdminMembershipPanel.js
index old...new 100644
--- a/components/AdminMembershipPanel.js
+++ b/components/AdminMembershipPanel.js
@@ -1,5 +1,6 @@
 import { useState, useEffect } from "react"
 import { supabase } from "../lib/supabase"
+import { useUser } from "@supabase/auth-helpers-react"
 
 export default function AdminMembershipPanel() {
   const [members, setMembers] = useState([])
@@ -10,6 +11,10 @@ export default function AdminMembershipPanel() {
   const [userInfo, setUserInfo] = useState(null)
   const [isAdmin, setIsAdmin] = useState(false)
   const [loadingUser, setLoadingUser] = useState(true)
+
+  // optionally integrate auth-helpers hook
+  const { user } = useUser() || {}
+
   // fetch user role to check admin
   const checkAdmin = async () => {
     if (!userInfo) {
       const { data } = await supabase.auth.getUser()
       setUserInfo(data.user)
     }
     if (!userInfo?.email) {
       setIsAdmin(false)
       setLoadingUser(false)
       return
     }
     const { data: u } = await supabase
       .from("users")
       .select("role")
       .eq("email", userInfo.email)
       .single()
     setIsAdmin(u?.role === "admin")
     setLoadingUser(false)
   }
 
   useEffect(() => {
     checkAdmin()
     fetchMembers()
@@ -80,7 +85,7 @@ return (
       {!isAdmin ? (
         <div className="min-h-[200px] text-center text-gray-400">
           <h2 className="text-xl font-semibold text-yellow-500">
-            🚫 Restricted Access
+            🚫 Access Denied
           </h2>
           <p className="mt-2">You do not have permission to view this area.</p>
         </div>
