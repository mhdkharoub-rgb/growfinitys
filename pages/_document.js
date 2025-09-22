import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Memberstack MUST use your PUBLIC KEY (pk_...), not app_ */}
        <script
          src="https://api.memberstack.io/static/memberstack.js?custom"
          data-memberstack-id="app_cmfpuki7k01750wwsgi71cena"
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
