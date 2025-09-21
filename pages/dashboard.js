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

// pages/dashboard.js
export default function Dashboard() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Your Free Trial Content Pack</h1>
      <a href="https://drive.google.com/drive/folders/1v5B394mmUshdFyXQ0rjDrVE2PlGpMyLl?usp=drive_link" className="btn-gold inline-block">Download Free Pack</a>
    </main>
  );
}
