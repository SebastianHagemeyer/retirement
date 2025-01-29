import { Connection, PublicKey } from "@solana/web3.js";


const SOLANA_MAINNET = process.env.NEXT_PUBLIC_RPC;
const connection = new Connection(SOLANA_MAINNET);

let cachedHolderCount = null; // Cache to store holder count
let lastFetchTime = null; // Timestamp for the last fetch
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default async function handler(req, res) {
    try {

        const tokenAddress = req.query.tokenAddress; // Token mint address from query

        if (!tokenAddress) {
            return res.status(400).json({ error: "Missing token address" });
        }

        const now = Date.now();

        // Check if the cached result is still valid
        if (cachedHolderCount !== null && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
            //console.log("CACHED", cachedHolderCount)
            return res.status(200).json({ holderCount: cachedHolderCount });
        } else {
            console.log("running intensive")


            // Run the function to fetch holders
            const mintPublicKey = new PublicKey(tokenAddress);
            const tokenAccounts = await connection.getProgramAccounts(
                new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                {
                    filters: [
                        { dataSize: 165 }, // Token account size
                        {
                            memcmp: {
                                offset: 0, // Mint address starts at byte 0
                                bytes: mintPublicKey.toBase58(), // Base58 representation
                            },
                        },
                    ],
                }
            );

            // Filter out accounts with zero balances
            const holders = tokenAccounts.filter((account) => {
                const data = account.account.data;
                const balance = data.slice(64, 72); // Balance at offset 64-72
                const balanceValue = Number(balance.readBigUInt64LE(0));
                return balanceValue > 0;
            });

            

            // Cache the result
            cachedHolderCount = holders.length;
            lastFetchTime = now;

            res.status(200).json({ holderCount: cachedHolderCount });
        }
    } catch (error) {
        console.error("Error fetching holder count", error);
        res.status(500).json({ error: "Failed to fetch holder count" });
    }
}