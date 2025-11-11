"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function finish() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const email = session.user.email;
      if (email === "mhdkharoub@gmail.com") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    }

    finish();
  }, [router, supabase]);

  return <p>Authenticating…</p>;
}
