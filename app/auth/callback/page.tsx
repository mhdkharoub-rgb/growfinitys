"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const processLogin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      if (session.user.email === "mhdkharoub@gmail.com") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    };

    processLogin();
  }, [router]);

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      Completing sign-in…
    </div>
  );
}
