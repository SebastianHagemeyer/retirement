import { useState } from "react";
import { Connection } from "@solana/web3.js";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";

const SOLANA_MAINNET =
  "https://mainnet.helius-rpc.com/?api-key=73809f9b-908c-4fb7-bb8c-001d4de5071c";

const connection = new Connection(SOLANA_MAINNET);

export const useWalletNFTs = (updateAuthority) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNFTs = async (walletAddress) => {
    try {
      if (!walletAddress) throw new Error("Wallet public key is undefined");
      setLoading(true);

      const nftArray = await getParsedNftAccountsByOwner({
        publicAddress: walletAddress,
        connection: connection,
        serialization: true,
      });

      const metadatas = [];
      for (const nft of nftArray) {
        try {
          const response = await fetch(nft.data.uri);
          const meta = await response.json();
          metadatas.push({ ...meta, ...nft });
        } catch (error) {
          console.error("Error fetching metadata:", error);
        }
      }

      // Filter NFTs by `updateAuthority`
      const filteredNFTs = metadatas.filter(
        (nft) => nft.updateAuthority === updateAuthority
      );
      setNfts(filteredNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  return { nfts, loading, fetchNFTs };
};
