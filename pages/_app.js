import Head from "next/head"
import "../styles/globals.css"
import FloatingCTA from "../components/FloatingCTA"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <script
          async
          src="https://cdn.nas.io/sdk.js"
          data-nasio-id="YOUR_NASIO_ID" 
        ></script>
      </Head>
      <Component {...pageProps} />
      {/* Floating CTA visible only on mobile */}
      <FloatingCTA />
    </>
  )
}

export default MyApp
