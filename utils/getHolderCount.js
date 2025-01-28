const SOLANA_MAINNET = process.env.NEXT_PUBLIC_RPC;
const connection = new Connection(SOLANA_MAINNET);


async function getHolders(tokenAddress) {
    try {
        // Convert mint addresses to PublicKey
        const mintPublicKey = new PublicKey(tokenAddress);

        //console.log(mintPublicKey)
        const tokenAccounts = await connection.getProgramAccounts(
            new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // SPL Token Program ID
            {
                filters: [
                    {
                        dataSize: 165, // Size of token accounts
                    },
                    {
                        memcmp: {
                            offset: 0, // Mint address starts at byte 0
                            bytes: mintPublicKey.toBase58(), // Base58 representation of the mint address
                        },
                    },
                ],
            }
        );
        //console.log(tokenAccounts)

        // Filter out token accounts with zero balances
        const holders = tokenAccounts.filter((account) => {
            const data = account.account.data;
            const balance = data.slice(64, 72); // Balance is stored at byte offset 64-72
            const balanceValue = Number(balance.readBigUInt64LE(0));
            return balanceValue > 0;
        });

        // Number of unique holders
        const holderCountD = holders.length;
        return holderCountD

        //res.status(200).json({ holderCount });
    } catch (error) {
        console.error('Error fetching holder count', error);
        throw error;
    }
}