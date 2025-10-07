import { useRouter } from "next/router"
import { supabase } from "../lib/supabase"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-yellow-500 text-sm font-semibold transition"
    >
      Log Out
    </button>
  )
}
