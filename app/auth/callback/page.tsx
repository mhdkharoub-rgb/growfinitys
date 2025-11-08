"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.email === "mhdkharoub@gmail.com") {
        router.replace("/admin");
        return;
      }

      router.replace("/dashboard");
    };

    handleSession();
  }, [router]);

  return <p style={{ padding: 40 }}>Completing sign-in…</p>;
}
