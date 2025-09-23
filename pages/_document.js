import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Memberstack script */}
        <script
          src="https://api.memberstack.io/static/memberstack.js?custom"
          data-memberstack-id="pk_b11e99cdfec26904e3e0"
          async
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
