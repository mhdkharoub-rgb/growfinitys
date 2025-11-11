"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallback() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    async function finish() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return router.replace("/login");

      const email = session.user.email;
      if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || email === "mhdkharoub@gmail.com") {
        return router.replace("/admin");
      }

      return router.replace("/dashboard");
    }
    finish();
  }, []);

  return <p style={{ textAlign: "center", marginTop: "80px" }}>Authenticating…</p>;
}
