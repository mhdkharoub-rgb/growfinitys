// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          src="https://api.memberstack.io/static/memberstack.js?custom"
          data-memberstack-id="YOUR_MEMBERSTACK_PUBLIC_KEY"
          async
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
