"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

const ADMIN_EMAIL = "mhdkharoub@gmail.com";
const supabase = createClient();

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function redirectByRole(userId: string, email?: string) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (profile?.role === "admin") {
        router.replace("/admin");
        return;
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

      if (profile.email === ADMIN_EMAIL || profile.role === "admin") {
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
        } else {
          router.replace("/dashboard");
        }
      }
    );

      const targetEmail = email ?? (await supabase.auth.getUser()).data.user?.email;
      if (targetEmail === ADMIN_EMAIL) {
        router.replace("/admin");
        return;
      }
    } catch (error) {
      console.error("Role lookup failed", error);
    }

    router.replace("/dashboard");
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.user) {
          await redirectByRole(session.user.id, session.user.email || undefined);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogin() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email: ADMIN_EMAIL });

      if (error) {
        alert(`❌ ${error.message}`);
      } else {
        alert("✅ Magic login link has been sent to your email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 360,
        margin: "80px auto",
        padding: 24,
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Growfinitys Admin Login</h2>
      <p>Access your internal dashboard securely.</p>

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          marginTop: 24,
          padding: "12px 24px",
          fontSize: 16,
          cursor: loading ? "default" : "pointer",
          borderRadius: 6,
          border: "1px solid #111",
        }}
      >
        {loading ? "Sending magic link..." : "Login as Admin"}
      </button>
    </div>
  );
}
