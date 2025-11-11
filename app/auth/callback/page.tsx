"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function run() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      // ✅ If login is successful, route based on email
      if (session.user.email === "mhdkharoub@gmail.com") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    }

    run();
  }, [router, supabase]);

  return <p>Authenticating…</p>;
}
