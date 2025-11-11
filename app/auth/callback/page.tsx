"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const processLogin = async () => {
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user?.email;

      if (!email) {
        router.replace("/login");
        return;
      }

      // ✅ Admin goes to admin dashboard
      if (email === ADMIN_EMAIL) {
        router.replace("/admin");
        return;
      }

      // ✅ Normal user goes to VIP dashboard
      router.replace("/dashboard");
    };

    processLogin();
  }, []);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      Logging you in...
    </div>
  );
}
