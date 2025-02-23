import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import WalletButton from "../components/WalletButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAssociatedTokenAddress } from "@solana/spl-token";


import { AnchorProvider, Program, web3, BN } from "@coral-xyz/anchor";
import idl from "../idl/solana_lock_contract2.json"; // Import the IDL file

import { PublicKey, Connection, SystemProgram } from "@solana/web3.js";

//  Smart Contract Program ID
const PROGRAM_ID = new PublicKey("7oFgc3PZxm5S4z8gkVcE5HD5sZr6v5VHA9xD22fo9HBf");
// Token Mint Address
const TOKEN_MINT = new PublicKey("EBsUinKdtJCfvriuBRunX5vJNEYTJWYSBMFvFTWsJ4ns");
// Connection to Solana
const network = "https://api.devnet.solana.com";
const connection = new Connection(network, "confirmed");

const Home = () => {
  const wallet = useWallet();
  const [totalLocked, setTotalLocked] = useState(0);
  const [amount, setAmount] = useState(0);
  const [lockedAmount, setLockedAmount] = useState(0);
  const [unlockTime, setUnlockTime] = useState(0);
  const [lockStatePda, setLockStatePda] = useState(null);

  // Get Provider for Anchor
  const getProvider = () => {
    if (!wallet || !wallet.connected) return null;
    return new AnchorProvider(connection, wallet, { preflightCommitment: "processed" });
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

      const program = new Program(idl, provider);
      const user = wallet.publicKey;

      // ✅ Fetch the user’s associated token account for the Retirement Coin (SPL Token)
      const userTokenAccount = await getAssociatedTokenAddress(
        TOKEN_MINT, // Your SPL token mint
        user // User's wallet address
    );
    toast.success(`User Token Account  ${userTokenAccount}`);
    console.log(`User Token Account  ${userTokenAccount}`)
    
     // 🔥 Generate a PDA for LockState
     const [lockStatePda] = await PublicKey.findProgramAddressSync(
      [Buffer.from("lock-state"), user.toBuffer()],
      PROGRAM_ID
    ); 

    toast.success(`PDA  ${lockStatePda}`);
    console.log(`PDA  ${lockStatePda}`);
    /*setLockStatePda(lockStatePda); // Store PDA in state for unlock
    console.log("LockStatePDA ", lockStatePda);*/

    // ❌ OLD WAY: Generate a Keypair for `lock_state`
    //const lockStateAccount = web3.Keypair.generate(); // This is manually created and stored


    //🔥 Vault Token Account (Derived ATA)
    const vaultTokenAccount = await getAssociatedTokenAddress(TOKEN_MINT, lockStatePda, true);
    toast.success(`PTA  ${vaultTokenAccount}`);
    console.log(`PTA  ${lockStatePda}`);

     // Execute transaction
    const tx = await program.methods
    .lock(new BN(amount))
    .accounts({
      user, // ✅ Wallet signs
      userTokenAccount, // ✅ User's ATA
      lockState: lockStatePda, // ✅ Using a manually created Keypair
      vaultTokenAccount,         // ✅ Vault token ATA
      mint: TOKEN_MINT,          // ✅ SPL Token Mint
      tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // ✅ SPL Token Program
      systemProgram: SystemProgram.programId,
    })
    .signers([]) // ✅ `lockStateAccount` must be a signer
    .rpc();

    console.log("✅ Tokens locked successfully:", tx);
    toast.success(`Locked ${amount} tokens!`);
      
    } catch (error) {
      console.error("❌ Error locking tokens:", error);
      toast.error("Lock transaction failed.");
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

      if (!lockStatePda) {
        toast.error("No locked tokens found!");
        return;
      }

      // Execute unlock transaction
      const tx = await program.methods
        .unlock()
        .accounts({
          user: wallet.publicKey,
          userTokenAccount: wallet.publicKey,
          vaultTokenAccount: wallet.publicKey, // Update with correct vault account
          lockState: lockStatePda,
          programAuthority: wallet.publicKey,
          mint: TOKEN_MINT,
          tokenProgram: TOKEN_MINT, // Update as needed
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("✅ Tokens unlocked successfully:", tx);
      toast.success("Unlocked tokens!");
      setLockedAmount(0);
    } catch (error) {
      console.error("❌ Error unlocking tokens:", error);
      toast.error("Unlock transaction failed.");
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
