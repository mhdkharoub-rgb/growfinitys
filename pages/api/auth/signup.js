// pages/api/auth/signup.js
import { supabase } from "../../../lib/supabase";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 2️⃣ Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 3️⃣ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Insert new user into Supabase
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ email, password_hash: hashedPassword }]);

    if (insertError) {
      console.error("❌ Insert Error:", insertError);
      return res.status(500).json({ error: "Failed to register user" });
    }

    return res.status(201).json({ success: true, message: "Signup successful" });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
