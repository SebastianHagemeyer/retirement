

const getHolders = async () => {
    try {
        const response = await fetch('https://retirementcoin.io/getHolders.php');
        const data = await response.json();
        return data.holders
    } catch (error) {
        console.error('Error fetching holders:', error);
    }
};




export const fetchDexScreenerData = async (tokenAddress) => {

    // get holdercount upload
    var holderCountD = null;
    if(0){ // not for production env, too laggy
        const resp1 = await fetch(`/api/getHolders?tokenAddress=${tokenAddress}`);
        const data1 = await resp1.json();
        holderCountD = data1.holderCount;
        //holderCountD = 123456;
        try {
            console.log("CALLING")
            // Call the PHP script
            const response = await fetch('https://retirementcoin.io/updateHolders.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ holders: holderCountD }),
            });
    
            const result = await response.json();
    
            // Relay the response from the PHP script to the client
            console.log("Finished calling")
            console.log(result);
        } catch (error) {
            console.error('Error calling PHP API:', error);
           // res.status(500).json({ error: 'Failed to call updateHolders API.' });
        }
    }


    holderCountD = await getHolders()
    //console.log(holderCountD)

    
    // end get holder count

    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);

    const data = await response.json();

    if (data.pairs && data.pairs.length > 0) {
        // Assume the first pair is the primary trading pool
        const pool = data.pairs[0];
        return {
            marketCap: pool.fdv || "N/A", // Fully diluted valuation
            volume24h: pool.volume.h24 || 0,
            liquidity: pool.liquidity || 0,
            holderCount: holderCountD || 0,
        };
    } else {
        throw new Error("No data available for this token");
    }
};