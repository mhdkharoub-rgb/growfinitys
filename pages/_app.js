diff --git a/pages/_app.js b/pages/_app.js
index abc1234..def5678 100644
--- a/pages/_app.js
+++ b/pages/_app.js
@@ -1,7 +1,15 @@
 import Head from "next/head"
 import "../styles/globals.css"
 
-export default function MyApp({ Component, pageProps }) {
-  return <Component {...pageProps} />
+export default function MyApp({ Component, pageProps }) {
+  return (
+    <>
+      <Head>
+        {/* Meta & Title */}
+        <title>Growfinitys — AI Trading Signals</title>
+        <meta name="viewport" content="width=device-width, initial-scale=1" />
+        <meta
+          name="description"
+          content="Premium AI-powered trading signals for Gold, Oil, Forex & Crypto."
+        />
+      </Head>
+      <div className="pt-[72px]"><Component {...pageProps} /></div>
+    </>
+  )
 }
