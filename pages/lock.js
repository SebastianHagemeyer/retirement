import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import WalletButton from "../components/WalletButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletNFTs } from "../hooks/useWalletNFTs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

import { AnchorProvider, Program, web3, BN } from "@coral-xyz/anchor";
import idl from "../idl/lthing.json"; // Import the IDL file

import { PublicKey, Connection, SystemProgram } from "@solana/web3.js";

//  Smart Contract Program ID
const PROGRAM_ID = new PublicKey("F6wJLynsvUEiE6uCKf9brrDgT7eA8Lcdr1f9uit6MaYL");
// Token Mint Address
const TOKEN_MINT = new PublicKey("EBsUinKdtJCfvriuBRunX5vJNEYTJWYSBMFvFTWsJ4ns");
// Connection to Solana
const network = "https://api.devnet.solana.com";
const connection = new Connection(network, "confirmed");


const Home = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);

  const wallet = useWallet();

  const [totalLocked, setTotalLocked] = useState(0);
  const [amount, setAmount] = useState(0);
  const [lockedAmount, setLockedAmount] = useState(0);
  const [unlockTime, setUnlockTime] = useState(0);


  // Get Provider for Anchor
  const getProvider = () => {
    if (!wallet || !wallet.connected) return null;
    return new AnchorProvider(connection, wallet, { preflightCommitment: "processed" });
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getUTCFullYear();
      const currentMonth = now.getUTCMonth();
      const targetDate = new Date(Date.UTC(currentYear, currentMonth, 22, 0, 0, 0));


      const difference = targetDate.getTime() - now.getTime();
      setTimeLeft(difference);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const lockTokens = async () => {

    try {
      if (!wallet.connected) {
        toast.error("Wallet not connected!");
        return;
      }

      const provider = getProvider();


      if (!provider) {
        console.error("❌ Provider is undefined!");
        return;
      }
      console.log(idl)
      console.log(PROGRAM_ID)
      console.log(provider)
      const program = new Program(idl, provider);

      const user = wallet.publicKey;
      const dataAccount = web3.Keypair.generate(); // Generate a storage account
      console.log("✅ Generated Data Account:", dataAccount.publicKey.toString());
      localStorage.setItem("dataAccountPublicKey", dataAccount.publicKey.toString());

      // ✅ Transaction: Store a Number
      const tx = await program.methods
        .initialize(new BN(amount)) // Convert to BN
        .accounts({
          user,
          dataAccount: dataAccount.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([dataAccount])
        .rpc();

      console.log("✅ Stored number successfully:", tx);
      toast.success(`Stored number: ${amount}`);

      setLockedAmount(amount);
    } catch (error) {
      console.error("❌ Error storing number:", error);
      toast.error("Transaction failed.");
    }


  };

  const unlockTokens = async () => {
    try {
      if (!wallet.connected) {
        toast.error("Wallet not connected!");
        return;
      }

      const provider = getProvider();
      if (!provider) {
        console.error("❌ Provider is undefined!");
        return;
      }

      const program = new Program(idl, provider);
      //console.log("✅ Program Loaded:", program);

      // Make sure you have the correct `dataAccountPublicKey`
      const storedKey = localStorage.getItem("dataAccountPublicKey");
      var dataAccountPublicKey = null
      if (storedKey) {
        dataAccountPublicKey = new PublicKey(storedKey);
      }

      //const dataAccountPublicKey = new PublicKey("YourDataAccountPublicKeyHere");

      // ✅ Fetch stored value
      const account = await program.account.data.fetch(dataAccountPublicKey);
      console.log("✅ Retrieved number:", account.value);
      toast.success(`Stored Number: ${account.value}`);

      //setLockedAmount(account.value); // Store in state
    } catch (error) {
      console.error("❌ Error retrieving number:", error);
      toast.error("Failed to retrieve number.");
    }

  }

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="dark" />


      <div className="uk-panel uk-position-z-index">
        <div className="uk-container">
          <div className="uk-panel">
            <div
              className="uk-grid uk-grid-2xlarge uk-flex-middle uk-flex-between uk-grid-stack"
              data-uk-grid=""
              data-uk-height-viewport="offset-top: true;"
              style={{ minHeight: "calc(-80px + 100vh)" }}
            >

              <div className="uk-container">
                <br></br><br></br><br></br>
                <h3 style={{ textAlign: 'center', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)', marginBottom: '0px' }}>Welcome to the</h3>
                <h1 style={{ fontSize: '4rem', fontWeight: 'bold', textAlign: 'center', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)', marginTop: '0px' }}>Locking System</h1>
                <p>Earn approximatley 4.3% APY on your Retirement Coin! This will be offered as a 1% return over 3 month terms. Some will pledge to lock their tokens not only for a reward, but to show the strength of our community and their belief in our project! </p>

                {wallet.connected ? (
                  <>
                    <div className="card uni-minting-item uk-card uk-card-medium uk-card-border uk-card-default uk-radius-medium uk-radius-large@m dark:uk-background-white-5">
                      <p className="dark:uk-text-gray-10">Total Locked: {totalLocked} RETIREMENT</p>
                      <p className="dark:uk-text-gray-10">Your Locked: {lockedAmount} RETIREMENT</p>
                      <p className="dark:uk-text-gray-10">Unlocks at: {new Date(unlockTime * 1000).toLocaleString()}</p>
                    </div>
                    <br></br>
                    <div className="card uni-minting-item uk-card uk-card-medium uk-card-border uk-card-default uk-radius-medium uk-radius-large@m dark:uk-background-white-5">
                      <h2 className="">Lock Management</h2>
                      <input
                        type="text"
                        placeholder="Enter amount"
                        className="uk-input uk-form-width-medium textF"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
                          setAmount(value);
                        }}
                      />
                      <button
                        className="uk-button uk-button-secondary"
                        onClick={lockTokens}
                      >
                        Lock
                      </button>

                      <button
                        className="uk-button uk-button-secondary"
                        onClick={unlockTokens}
                      >
                        Unlock
                      </button>
                    </div>
                  </>
                ) : (
                  <h2 className="">Please connect your wallet</h2>
                )}


                <br></br><br></br><br></br>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );

};

export default Home;
