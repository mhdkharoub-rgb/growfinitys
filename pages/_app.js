// pages/_app.js
import Head from "next/head"
import "../styles/globals.css"

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Growfinitys — AI Trading Signals</title>
        <meta
          name="description"
          content="Premium AI-powered trading signals for Gold, Oil, Forex, and Crypto."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="pt-[72px]"> {/* height of your navbar */}
        <Component {...pageProps} />
      </div>
    </>
  )
}
