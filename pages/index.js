import React, { useState, useEffect } from "react";


import Layout from "../components/Layout";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

import { getTokenBalance } from "../utils/getTokenBalance"; // Adjust path as needed
import { fetchDexScreenerData } from "../utils/dexScreener";


import { useRouter } from "next/router";

const Home = () => {
  const wallet = useWallet();

  const router = useRouter();

  const [tokenBalance, setTokenBalance] = useState(null);

  const [marketCap, setMarketCap] = useState(null);
  const [volume, setVolume] = useState(null);
  const [liquidity, setLiquidity] = useState(null);
  const [holderCount, setHolderCount] = useState(null);
  const [mwBalance, setMwBalance] = useState(null);
  const totalSupply = 998928617;

  const tokenMintAddress = "HLRGoPcK1n4fmkowVyBNkVHRoiiCUL2qyneNqTUNpump"; // Replace with the actual mint address


  // Format balance for display
  const formatBalance = (value) => {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return value.toFixed(1);
  };

  // get value of bal in USD
  const getUSD = (marketCap, bal) => {
    const tokenSupply = 998928617;
    const price = marketCap / totalSupply;

    return (price * bal)
  }


  useEffect(() => {

    const fetchData = async () => {
      try {
        const tokenAddress = "HLRGoPcK1n4fmkowVyBNkVHRoiiCUL2qyneNqTUNpump";
        const { marketCap, volume24h, liquidity, holderCount } = await fetchDexScreenerData(tokenAddress);

        const usdLiq = liquidity['usd'];
        //console.log(usdLiq)

        setLiquidity(usdLiq);
        setMarketCap(marketCap);
        setVolume(volume24h);
        setHolderCount(holderCount);

      } catch (error) {
        console.error("Error fetching market data", error);
      }
    }
    fetchData()


    async function fetchmwBal() {
      const mwBalance = await getTokenBalance("3V7UwuoyhJQ5KPsk42tYZ6LwCKEKNUHmZWi958DR3wJm", tokenMintAddress);
      //console.log(mwBalance)
      setMwBalance(mwBalance);
    }
    fetchmwBal()

    const fetchBalance = async (wallet) => {


      try {
        if (!wallet?.publicKey) {
          console.error("Wallet not connected or public key missing.");
          return;
        }


        const walletAddress = wallet.publicKey.toString();
        //console.log(walletAddress)
        const balance = await getTokenBalance(walletAddress, tokenMintAddress);
        console.log(balance)
        setTokenBalance(balance);
      } catch (error) {
        console.error("Error fetching token balance:", error);
      }
    };

    if (wallet.connected) {
      fetchBalance(wallet)
    }



  }, [wallet.connected, wallet]);

  return (
    <Layout>
      <div
        id="uni_hero"
        className="uni-hero uk-section-2xlarge uk-section-xlarge@m uk-padding-remove-bottom@m uk-panel"
      >
        <div
          className="uk-position-top uk-position-z-index-negative uk-overflow-hidden uk-blend-overlay"
          data-uk-height-viewport=""
          style={{ minHeight: "calc(100vh)" }}
        >
          <img
            className="uk-position-top-left uk-position-fixed uk-blur-large"
            style={{ left: "-4%", top: "-4%" }}
            width="500"
            src="/assets/images/gradient-circle.svg"
            alt="Circle"
          />
          <img
            className="uk-position-bottom-right uk-position-fixed uk-blur-large"
            style={{ right: "-4%", bottom: "-4%" }}
            width="500"
            src="/assets/images/gradient-circle.svg"
            alt="Circle"
          />
        </div>

        <div
          className="uk-position-top uk-position-z-index-negative uk-opacity-50"
          data-uk-height-viewport=""
          style={{ minHeight: "calc(100vh)" }}
        >

        </div>

        <div className="uk-panel uk-position-z-index">
          <div className="uk-container">
            <div className="uk-panel">
              <div
                className="uk-grid uk-grid-2xlarge uk-flex-middle uk-flex-between uk-grid-stack"
                data-uk-grid=""
                data-uk-height-viewport="offset-top: true;"
                style={{ minHeight: "calc(-80px + 100vh)" }}
              >
                <div
                  className="uk-width-1-1 uk-flex uk-flex-center uk-flex-middle uk-first-column"
                  style={{ height: "auto" }}
                >
                  <div className="centerText">
                    {/*<div className="uk-button uk-button-large@m uk-button-gradient uk-margin-small-top" >
                      <WalletMultiButton />
                    </div>*/}
                    <br></br>
                    <h1>Welcome to the <span className="uk-text-gradient" data-text="Coin Dashboard">Coin Dashboard</span> </h1> {/*<h3 style={{ marginTop: "0" }}>(WIP)</h3> */}

                    {wallet.connected && (
                      <>
                        <p style={{ wordBreak: 'break-word' }}>Connected wallet: {wallet.publicKey.toString()}</p>

                      </>
                    )}

                    <button
                      className="uk-button uk-button-large@m uk-button-gradient buttMarg"
                      onClick={() => router.push("https://retirementcoin.io")}
                    >
                      <i className="material-icons">home</i>
                    </button>
                    <button
                      className="uk-button uk-button-large@m uk-button-gradient buttMarg"
                      onClick={() => router.push("/view")}
                    >
                      View
                    </button>
                    <button
                      className="uk-button uk-button-large@m uk-button-gradient buttMarg"
                      onClick={() => router.push("/mint")}
                    >
                      Mint
                    </button>
                    <button
                      className="uk-button uk-button-large@m uk-button-gradient buttMarg"
                      onClick={() => router.push("/vote")}
                    >
                      Vote
                    </button>
                    <button
                      className="uk-button uk-button-large@m uk-button-gradient buttMarg"
                      onClick={() => router.push("/lock")}
                    >
                      Lock
                    </button>

                    <h1>Your Retirement Coin</h1>
                    <div className="uk-container uk-padding">
                      <div className="uk-card uk-card-default uk-card-body uk-border-rounded uk-box-shadow-medium dark:uk-background-white-10">
                        <div className="uk-grid-small uk-child-width-1-2@s uk-child-width-1-3@m uk-text-center" data-uk-grid>

                          <div >
                            <div className="uk-text-lead uk-text-bold dark:uk-text-gray-10">Balance</div>
                            <div className="uk-text-large uk-text-success dark:uk-text-gray-10 balance">{tokenBalance !== null ? formatBalance(tokenBalance) : "?"}</div>
                          </div>

                          <div >
                            <div className="uk-text-lead uk-text-bold dark:uk-text-gray-10">Balance USD</div>
                            <div className="uk-text-large uk-text-success dark:uk-text-gray-10 balance">{((tokenBalance !== null) && (marketCap !== null)) ? "$" + formatBalance(getUSD(marketCap, tokenBalance)) : "?"}</div>
                          </div>


                          <div >
                            <div className="uk-text-lead uk-text-bold dark:uk-text-gray-10">% of supply</div>
                            <div className="uk-text-large uk-text-success dark:uk-text-gray-10 balance">{((tokenBalance !== null)) ? ((tokenBalance / totalSupply) * 100).toFixed(2) + "%" : "?"}</div>
                          </div>

                        </div>
                      </div>
                    </div>

                    <h1>Marketing wallet</h1>

                    <div className="uk-container uk-padding">
                      <div className="uk-card uk-card-default uk-card-body uk-border-rounded uk-box-shadow-medium dark:uk-background-white-10">

                        <div className="container uk-card uk-card-default uk-card-body uk-border-rounded uk-margin-medium-bottom uk-box-shadow-medium dark:uk-background-white-10">
                          <p className="dark:uk-text-gray-10" >Retirement Coin is going to be distributed among holders over a 3 month locking period availible on the locking page! Unfortunatley $4.5k of MW funds was stolen by Brandon Cooper.</p>
                        </div>

                        <div className="uk-grid-small uk-child-width-1-2@s uk-child-width-1-3@m uk-text-center" data-uk-grid>

                          <div >
                            <div className="uk-text-lead uk-text-bold dark:uk-text-gray-10">Balance</div>
                            <div className="uk-text-large uk-text-success dark:uk-text-gray-10 balance">{mwBalance !== null ? formatBalance(mwBalance) : "?"}</div>
                          </div>

                          <div >
                            <div className="uk-text-lead uk-text-bold dark:uk-text-gray-10">Balance USD</div>
                            <div className="uk-text-large uk-text-success dark:uk-text-gray-10 balance">{((mwBalance !== null) && (marketCap !== null)) ? "$" + formatBalance(getUSD(marketCap, mwBalance)) : "?"}</div>
                          </div>


                          <div >
                            <div className="uk-text-lead uk-text-bold dark:uk-text-gray-10">% of supply</div>
                            <div className="uk-text-large uk-text-success dark:uk-text-gray-10 balance">{((mwBalance !== null)) ? ((mwBalance / totalSupply) * 100).toFixed(2) + "%" : "?"}</div>
                          </div>

                        </div>
                      </div>
                    </div>

                    <h1>Statistics</h1>
                    <div className="uk-container uk-padding">
                      <div className="uk-card uk-card-default uk-card-body uk-border-rounded uk-box-shadow-medium dark:uk-background-white-10">
                        <div className="uk-grid-small uk-child-width-1-2@s uk-child-width-1-3@m uk-text-center" data-uk-grid>
                          <div>
                            <div className="uk-text-lead uk-text-bold dark:uk-text-gray-10">Market Cap</div>
                            <div className="uk-text-large  uk-text-success dark:uk-text-gray-10 market-cap">{marketCap !== null ? "$" + marketCap.toLocaleString("en-US") : "?"}</div>
                          </div>


                          <div>
                            <div className="uk-text-lead uk-text-bold dark:uk-text-gray-10">24H Volume</div>
                            <div className="uk-text-large uk-text-success dark:uk-text-gray-10 volume">{volume !== null ? "$" + volume.toLocaleString("en-US") : "?"}</div>
                          </div>


                          <div>
                            <div className="uk-text-lead uk-text-bold dark:uk-text-gray-10" >Holders</div>
                            <div className="uk-text-large uk-text-success dark:uk-text-gray-10 holders">{holderCount !== null ? holderCount.toLocaleString("en-US") : "?"}</div>
                          </div>


                          <div>
                            <div className="uk-text-lead uk-text-bold dark:uk-text-gray-10">Liquidity</div>
                            <div className="uk-text-large uk-text-success dark:uk-text-gray-10 liquidity">{liquidity !== null ? "$" + liquidity.toLocaleString("en-US") : "?"}</div>
                          </div>

                          <div>
                            <div className="uk-text-lead uk-text-bold dark:uk-text-gray-10">Total Supply</div>
                            <div className="uk-text-large uk-text-success dark:uk-text-gray-10 liquidity">{formatBalance(totalSupply)}</div>
                          </div>

                        </div>
                      </div>

                    </div>




                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>


    </Layout>
  );
};

export default Home;
