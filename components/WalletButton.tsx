"use client"; // Ensure it runs only on the client

import React, { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const WalletButton = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensures it loads after hydration
  }, []);

  return mounted ? <WalletMultiButton /> : null; // Prevents SSR mismatch
};

export default WalletButton;