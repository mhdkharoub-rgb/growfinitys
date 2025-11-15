"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL as string | undefined;

export default function AuthCallbackPage() {
  const router = useRouter();
  const qs = useSearchParams();

  useEffect(() => {
    (async () => {
      const error = qs.get("error_description") || qs.get("error");
      if (error) {
        alert("Auth Notice: " + error.replace(/\+/g, " "));
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const email = session.user.email?.toLowerCase() ?? "";
        if (ADMIN_EMAIL && email === ADMIN_EMAIL.toLowerCase()) {
          router.replace("/admin");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profile?.role === "admin") router.replace("/admin");
        else router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    })();
  }, [qs, router]);

  return (
    <main style={{ minHeight: "60dvh", display: "grid", placeItems: "center" }}>
      <p style={{ opacity: 0.85 }}>Finishing sign-in…</p>
    </main>
  );
}
