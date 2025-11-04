"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LogoutBar() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <div className="fixed top-0 right-0 p-4">
      <button
        onClick={handleLogout}
        className="border border-gold text-gold px-4 py-2 rounded hover:bg-gold hover:text-black transition"
      >
        🔒 Logout
      </button>
    </div>
  );
}
