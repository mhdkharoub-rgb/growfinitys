import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        const adminEmails = ["mhdkharoub123@gmail.com"]; // add more if needed
        if (adminEmails.includes(data.user.email)) setIsAdmin(true);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-black text-white fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-yellow-500">
          Growfinitys
        </Link>

        {/* Links */}
        <div className="hidden md:flex space-x-8 text-sm font-semibold">
          <a href="#features" className="hover:text-yellow-400 transition">
            Features
          </a>
          <a href="#pricing" className="hover:text-yellow-400 transition">
            Pricing
          </a>
          <a href="#how" className="hover:text-yellow-400 transition">
            How It Works
          </a>

          {/* Dashboard */}
          {user && (
            <Link
              href="/dashboard"
              className="border border-yellow-500 text-yellow-500 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 hover:text-black transition"
            >
              Dashboard
            </Link>
          )}

          {/* Admin Panel (only for admin users) */}
          {isAdmin && (
            <Link
              href="/admin"
              className="border border-purple-500 text-purple-400 font-semibold py-2 px-4 rounded-lg hover:bg-purple-600 hover:text-white transition"
            >
              Admin Panel
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                href="/login"
                className="bg-yellow-500 text-black font-semibold py-2 px-5 rounded-lg hover:bg-yellow-400 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="border border-yellow-500 text-yellow-500 font-semibold py-2 px-5 rounded-lg hover:bg-yellow-500 hover:text-black transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
