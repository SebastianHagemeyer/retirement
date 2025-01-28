

export const fetchDexScreenerData = async (tokenAddress) => {

    // get holdercount 
    var holderCountD = null;
    if(1){
        const resp1 = await fetch(`/api/getHolders?tokenAddress=${tokenAddress}`);
        const data1 = await resp1.json();
        holderCountD = data1.holderCount;
    }

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