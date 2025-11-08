"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const finishLogin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      const email = session.user.email;

      if (email === "mhdkharoub@gmail.com") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    };

    finishLogin();
  }, [router]);

  return <div style={{ padding: 40 }}>Completing sign-in…</div>;
}
