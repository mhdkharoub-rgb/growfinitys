// /pages/restricted.js
import Link from "next/link"

export default function Restricted() {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-6xl font-bold text-yellow-500 mb-4 animate-pulse">
        🚫 Access Denied
      </h1>
      <p className="text-gray-300 max-w-md mb-6">
        You don’t have permission to view this page.  
        Only administrators can access this section of Growfinitys.
      </p>
      <Link
        href="/"
        className="bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-400 transition"
      >
        ← Back to Home
      </Link>
    </div>
  )
}
