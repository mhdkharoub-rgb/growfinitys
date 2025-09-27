import Head from "next/head"
import "../styles/globals.css"

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
    </>
  )
}

export default MyApp
