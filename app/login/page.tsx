"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const ADMIN_EMAIL = "mhdkharoub@gmail.com";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Redirect based on role
  const redirectByRole = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, role")
        .eq("id", userId)
        .single();

      if (profile?.email === ADMIN_EMAIL || profile?.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } catch {
      router.replace("/dashboard");
    }
  };

  // ✅ Listen for Supabase login event
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.user?.id) {
          await redirectByRole(session.user.id);
        }
      }
    );
    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  // ✅ Magic Link Login
  const handleLogin = async () => {
    try {
      setLoading(true);
      const email = ADMIN_EMAIL; // Only admin login right now
      const { error } = await supabase.auth.signInWithOtp({ email });

      if (error) {
        alert(`❌ ${error.message}`);
      } else {
        alert("✅ Magic link sent to your email!");
      }
    } finally {
      setLoading(false);
    }
  };

  async function handleLogin() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: ADMIN_EMAIL,
      });

      if (error) {
        alert(`❌ ${error.message}`);
      } else {
        alert("✅ Magic link sent to your email!");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Magic link login
  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: "mhdkharoub@gmail.com",
      });
      if (error) alert(`❌ ${error.message}`);
      else alert("✅ Magic link sent to your email!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Listen for auth state change
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          await redirectUser(session);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await redirectByRole(session.user.id, session.user.email ?? undefined);
      }
    });

    return () => {
      data.subscription?.unsubscribe();
    };
  }, []);

  return (
    <main style={{ padding: "80px", textAlign: "center" }}>
      <h1>Growfinitys Login</h1>
      <p>Enter using your secure admin magic link login.</p>

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "12px 22px",
          background: loading ? "#999" : "black",
          color: "white",
          borderRadius: "8px",
          border: "none",
          cursor: loading ? "default" : "pointer",
        }}
      >
        {loading ? "Sending..." : "Send Magic Login Link"}
      </button>
    </main>
  );
}
