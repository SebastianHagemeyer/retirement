import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import WalletButton from "../components/WalletButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletNFTs } from "../hooks/useWalletNFTs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

import { AnchorProvider, Program, web3, BN } from "@coral-xyz/anchor";
import idl from "../idl/solana_lock_contract2.json"; // Import the IDL file

//  Smart Contract Program ID
const PROGRAM_ID = new PublicKey("4pZoMCZbXipZf6n3m64fPvdi7pMo14Wa6dvvSSJjNQX2");
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
      const program = new Program(idl, PROGRAM_ID, provider);

      const user = wallet.publicKey;
      const lockState = web3.Keypair.generate(); // New account for lock state

       // ✅ Fetch the user’s associated token account for the Retirement Coin (SPL Token)
       const userTokenAccount = await getAssociatedTokenAddress(
        TOKEN_MINT, // Your SPL token mint
        user // User's wallet address
    );

    // ✅ Fetch the vault's associated token account
    const vaultTokenAccount = await getAssociatedTokenAddress(
        TOKEN_MINT,
        PROGRAM_ID, // The vault is owned by the program
        true // This ensures it derives a valid associated token account
    );

    // ✅ Transaction: Lock Tokens
    const tx = await program.methods
        .lock(new BN(amount)) // Convert to BN
        .accounts({
            user,
            userTokenAccount,
            lockState: lockState.publicKey,
            vaultTokenAccount,
            mint: TOKEN_MINT,
            tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // SPL Token Program
            systemProgram: SystemProgram.programId,
        })
        .signers([lockState])
        .rpc();

      console.log("✅ Locked successfully:", tx);
      toast.success(`Locked ${amount} RETIREMENT successfully!`);

      setLockedAmount(amount);
      setUnlockTime(Math.floor(Date.now() / 1000) + 300); // Add 5 minutes

    } catch (error) {
      console.error("❌ Error locking tokens:", error);
      toast.error("Transaction failed.");
    }

    
    
    
  };


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
                <h3 style={{ textAlign: 'center', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' , marginBottom: '0px'}}>Welcome to the</h3>
                <h1 style={{ fontSize: '4rem', fontWeight: 'bold', textAlign: 'center', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)', marginTop: '0px'}}>Locking System</h1>
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
