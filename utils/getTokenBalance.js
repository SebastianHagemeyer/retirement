import { Connection, PublicKey } from "@solana/web3.js";


const SOLANA_MAINNET = process.env.NEXT_PUBLIC_RPC;
const connection = new Connection(SOLANA_MAINNET);

export async function getTokenBalance(walletAddress, tokenMintAddress) {
    try {
      // Convert wallet and token mint addresses to PublicKey
      const walletPublicKey = new PublicKey(walletAddress);
      const tokenMintPublicKey = new PublicKey(tokenMintAddress);
  
      // Get all token accounts owned by the wallet
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
        mint: tokenMintPublicKey,
      });
  
      // Check if the wallet holds the token
      if (tokenAccounts.value.length === 0) {
        console.log('No token accounts found for this mint address.');
        return 0;
      }
  
      // Retrieve the balance from the first token account
      const tokenAccountInfo = tokenAccounts.value[0].account.data.parsed.info;
      const balance = tokenAccountInfo.tokenAmount.uiAmount; // Human-readable balance
  
      console.log(`Token balance: ${balance}`);
      return balance;
    } catch (error) {
      console.error('Error fetching token balance:', error);
      throw error;
    }
  }