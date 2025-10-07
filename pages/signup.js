import AuthForm from "../components/AuthForm"

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <AuthForm mode="signup" />
    </main>
  )
}
