"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const finishAuth = async () => {
      // Validate session
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        router.replace("/login");
        return;
      }

      // Check email → decide destination
      if (session.user.email === ADMIN_EMAIL) {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    };

    finishAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p>Signing you in...</p>
    </div>
  );
}
