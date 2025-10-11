// pages/_app.js
import "../styles/globals.css"
import { createBrowserClient } from "@supabase/ssr"
import { SessionContextProvider } from "@supabase/auth-helpers-react"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function MyApp({ Component, pageProps }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
