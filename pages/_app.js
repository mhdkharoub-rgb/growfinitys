import Head from "next/head"
import "../styles/globals.css"

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Growfinitys — AI Trading Signals</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Premium AI-powered trading signals for Gold, Oil, Forex & Crypto."
        />
      </Head>
      <div className="pt-[72px]">
        <Component {...pageProps} />
      </div>
    </>
  )
}
