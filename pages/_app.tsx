import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useMemo } from "react";
import { UmiProvider } from "../utils/UmiProvider";
import "@/styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";


import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';



import { image, headerText } from 'settings'
import { SolanaTimeProvider } from "@/utils/SolanaTimeContext";


import { useEffect } from "react";
import { useRouter } from "next/router";


import "../public/assets/css/theme/main.min.css"; // Global styles
import "../public/assets/css/fa.min.css"; // Global styles
import "../public/assets/css/swiper-bundle.min.css"; // Swiper styles
import "../public/assets/css/uikit.min.css"; // UIkit styles

import Script from "next/script"; // For efficient script handling


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();


  let network = WalletAdapterNetwork.Devnet;
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "mainnet-beta" || process.env.NEXT_PUBLIC_ENVIRONMENT === "mainnet") {
    network = WalletAdapterNetwork.Mainnet;
  }
  let endpoint = "https://mainnet.helius-rpc.com/?api-key=73809f9b-908c-4fb7-bb8c-001d4de5071c";
  if (process.env.NEXT_PUBLIC_RPC) {
    endpoint = process.env.NEXT_PUBLIC_RPC;
  }
  const wallets = useMemo(
    () => [
    ],
    []
  );
  return (
    <>
    {/* Critical Scripts */}
    {/* <Script src="/assets/js/uikit.min.js" strategy="beforeInteractive" />
      <Script src="/assets/js/uikit-components.js" strategy="beforeInteractive" /> */}
      <Script src="/assets/js/app-head.js" strategy="beforeInteractive" />

      {/* Non-Critical Scripts */}
      <Script src="/assets/js/jquery.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/swiper-bundle.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/feather.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/typed.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/anime.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/swiper-helper.js" strategy="lazyOnload" />
      <Script src="/assets/js/typed-helper.js" strategy="lazyOnload" />
      <Script src="/assets/js/anime-helper.js" strategy="lazyOnload" />
      <Script src="/assets/js/anime-helper-defined-timelines.js" strategy="lazyOnload" />

    {/* Reloadable script */}
    <div id="dynamic-script-container">
        {/*<Script src="/assets/js/app.js" strategy="lazyOnload" id="app-js-script" />*/}
      </div>
       
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={headerText} />
        <meta
          property="og:description"
          content="Retirement NFT"
        />
        <meta name="description" content="Retirement NFT" />

        <meta
          property="og:image"
          content={image}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{headerText}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <ChakraProvider>*/}
        <WalletProvider wallets={wallets}>
          <UmiProvider endpoint={endpoint}>
            <WalletModalProvider>
              <SolanaTimeProvider>
                <Component {...pageProps} />
              </SolanaTimeProvider>
            </WalletModalProvider>
          </UmiProvider>
        </WalletProvider>
      {/* </ChakraProvider>*/}
    </>
  );
}
