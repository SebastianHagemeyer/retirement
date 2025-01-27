import { Html, Head, Main, NextScript } from 'next/document'

import Script from "next/script";

export default function Document() {
  return (
    <Html className="uk-background-white dark:uk-background-gray-100 dark:uk-text-gray-20 uk-dark" lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />

      </Head>
      <body>
        <Main />
        <NextScript />
        {/* UIkit JS - Load lazily */}

        {/* Use Script component for non-blocking scripts */}
        <Script
          src="https://cdn.jsdelivr.net/npm/uikit@3.16.15/dist/js/uikit.min.js"
          strategy="lazyOnload" // Ensures the script loads after the page is fully loaded
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/uikit@3.16.15/dist/js/uikit-icons.min.js"
          strategy="lazyOnload" // Ensures the script loads after the page is fully loaded
        />
     
      </body>
    </Html>
  )
}
