const handleLogin = async () => {
  try {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(`❌ ${error.message}`);
    } else {
      alert("✅ Magic login link sent to your email.");
    }
  } finally {
    setLoading(false);
  }
};
