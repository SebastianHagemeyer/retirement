import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import WalletButton from "../components/WalletButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAssociatedTokenAddress } from "@solana/spl-token";


import { AnchorProvider, Program, web3, BN } from "@coral-xyz/anchor";
import idl from "../idl/pda_with_deposit.json"; // Import the IDL file

import { PublicKey, Connection, SystemProgram } from "@solana/web3.js";

//  Smart Contract Program ID
const PROGRAM_ID = new PublicKey("3mj1qf6zYtJiskhVSt22B8a5yFB8psWY8pVhaF3R2UnV");
// Token Mint Address
const TOKEN_MINT = new PublicKey("EBsUinKdtJCfvriuBRunX5vJNEYTJWYSBMFvFTWsJ4ns");
const DECI = 1000000; // multiply for 6 decimals
// Connection to Solana
const network = "https://api.devnet.solana.com";
const connection = new Connection(network, "confirmed");

const Home = () => {
  const API_KEY = process.env.NEXT_PUBLIC_DB_API;

  const wallet = useWallet();
  const [totalLocked, setTotalLocked] = useState(null);
  const [amount, setAmount] = useState(0);
  const [lockedAmount, setLockedAmount] = useState(null);
  const [unlockTime, setUnlockTime] = useState(null);
  const [lockStatePda, setLockStatePda] = useState(null);

  useEffect(() => {
    async function fetchLockedAmount() {
        try {
            const res = await fetch("https://retirementcoin.io/get_all_locked.php");
            const data = await res.json();
            const totalLocked = parseFloat(data.total_locked || 0).toFixed(1);
            setTotalLocked(totalLocked || "0.0");
        } catch (error) {
            console.error("Fetch error:", error);
            setTotalLocked("Error retrieving data");
        }
    }

    fetchLockedAmount();
    }, []);

  // Get Provider for Anchor
  const getProvider = () => {
    if (!wallet || !wallet.connected) return null;
    return new AnchorProvider(connection, wallet, { preflightCommitment: "processed" });
  };
  const hexToDate = (hexString) => {
    // ✅ Convert hex string to integer
    const timestamp = parseInt(hexString);

    // ✅ Convert timestamp to a readable date
    return new Date(timestamp * 1000).toLocaleString();
  };

  const submitAction = async (walName, time, amount, txid) => {
    try {

        const response = await fetch("https://retirementcoin.io/lock_system.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY,
            },
            body: JSON.stringify({
                public_key: walName,
                timelock: time,
                amount: amount,
                txid: txid, 
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();

        try {
            const data = JSON.parse(text);
            toast[data.status === "success" ? "success" : "error"](data.message);
            console.log(data)
        } catch (jsonError) {
            console.error("JSON parse error:", text);
            toast.error("Unexpected server response.");
        }

    } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to connect to the server.");
    }
};

const unlockDB = async (walName) => {
  try {

      const response = await fetch("https://retirementcoin.io/unlock.php", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-API-KEY": API_KEY,
          },
          body: JSON.stringify({
              public_key: walName,
          }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();

      try {
          const data = JSON.parse(text);
          toast[data.status === "success" ? "success" : "error"](data.message);
          console.log(data)
      } catch (jsonError) {
          console.error("JSON parse error:", text);
          toast.error("Unexpected server response.");
      }

  } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to connect to the server.");
  }
};


const testF = async () => {
  //await submitAction("walName","1", "1", "txxxx");
  console.log("testF")
}


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
      //toast.success(`User Token Account  ${userTokenAccount}`);
      console.log(`User Token Account  ${userTokenAccount}`)

      // 🔥 Generate a PDA for LockState
      /*const [lockStatePda] = await PublicKey.findProgramAddressSync(
       [Buffer.from("lock-state"), user.toBuffer()],
       PROGRAM_ID
     ); */

      // Derive PDA Addresses
      const [pda] = await PublicKey.findProgramAddressSync(
        [Buffer.from("my_pda"), user.toBuffer()],
        PROGRAM_ID
      );
      //toast.success(`PDA  ${pda}`);
      console.log(`PDA  ${pda}`);


      const [pdaTokenAccount] = await PublicKey.findProgramAddressSync(
        [Buffer.from("token_account"), pda.toBuffer()],
        PROGRAM_ID
      );

      //toast.success(`PDTA  ${pdaTokenAccount}`);
      console.log(`PDTA  ${pdaTokenAccount}`);

      // userTokenAccount
      // TOKEN_MINT


      // Execute transaction
      const tx = await program.methods
        .createPdaAndDeposit(new BN(amount * DECI))  // multiply for 6 decimals
        .accounts({
          user, // ✅ Wallet signs
          myPda: pda, // ✅ User's ATA
          pdaTokenAccount: pdaTokenAccount, // ✅ Using a pda
          userTokenAccount: userTokenAccount,         // ✅ user token ATA
          mint: TOKEN_MINT,          // ✅ SPL Token Mint
          tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // ✅ SPL Token Program
          systemProgram: SystemProgram.programId,
          rent: new PublicKey("SysvarRent111111111111111111111111111111111"), // Rent Sysvar
        })
        .rpc();

      console.log("✅ Tokens locked successfully:", tx);
      toast.success(`Locked ${amount} tokens!`);
      
      const unixTime = Math.floor(Date.now() / 1000);
      await submitAction(user, unixTime, amount, tx.toString());

      console.log("Lock action submitted!");

    } catch (error) {
      console.error("❌ Error withdrawing tokens:", error);

      let errorMessage = "Lock transaction failed."; // Default message
      let errorText = error.toString();

      if (errorText) {

        // ✅ Extract logs containing our custom error messages
        const knownErrors = [
          "PDA already contains tokens. Withdraw before depositing again.",
          "No tokens available to withdraw.",
          "Tokens are still locked."
        ];

        // ✅ Check if the error message contains one of the known errors
        const extractedError = knownErrors.find(knownError => errorText.includes(knownError));

        if (extractedError) {
          errorMessage = extractedError; // ✅ Display only the matched error message
        }
      }

      toast.error(errorMessage, { autoClose: 5000 });
    }

  };

  const gInfo = async () => {
    console.log("Getting info")
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
      //toast.success(`User Token Account  ${userTokenAccount}`);
      console.log(`User Token Account  ${userTokenAccount}`)



      // Derive PDA Addresses
      const [pda] = await PublicKey.findProgramAddressSync(
        [Buffer.from("my_pda"), user.toBuffer()],
        PROGRAM_ID
      );
      //toast.success(`PDA  ${pda}`);
      console.log(`PDA  ${pda}`);




      // ✅ Check if PDA exists on-chain
      const accountInfo = await connection.getAccountInfo(pda);
      if (accountInfo) {
        console.log("✅ PDA exists:", accountInfo);
        //  toast.success("PDA exists!");
      } else {
        console.log("❌ PDA does not exist.");
        //  toast.error("PDA not found!");
      }
      //console.log(accountInfo)

      const pdaData = await program.account.pdaAccount.fetch(pda);

      if (!pdaData) {
        console.error("❌ No lock data found.");
        return null;
      }
      // ✅ Convert lock time from hex to a readable date
      const timeString = pdaData.lockTime.toString()
      const lockTime = timeString ? hexToDate(timeString) : "?";
      setUnlockTime(lockTime)
      console.log(timeString)
      console.log(lockTime)

      const [pdaTokenAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("token_account"), pda.toBuffer()],
        PROGRAM_ID
      );





      console.log("data2 ", pdaData)
      // ✅ Get balance of the PDA's token account
      const balanceInfo = await connection.getTokenAccountBalance(pdaTokenAccount);
      const balance = balanceInfo.value.amount / DECI;

      console.log(`🔒 PDA Token Balance: ${balance}`);
      setLockedAmount(balance)

    } catch (error) {
      toast.error("Error Fetching Info.");
    }

  };

  const unlockTokens = async () => {
    console.log("Trying unlock.")
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
      //toast.success(`User Token Account  ${userTokenAccount}`);
      console.log(`User Token Account  ${userTokenAccount}`)



      // Derive PDA Addresses
      const [pda] = await PublicKey.findProgramAddressSync(
        [Buffer.from("my_pda"), user.toBuffer()],
        PROGRAM_ID
      );
      //toast.success(`PDA  ${pda}`);
      console.log(`PDA  ${pda}`);




      // ✅ Check if PDA exists on-chain
      const accountInfo = await connection.getAccountInfo(pda);
      if (accountInfo) {
        console.log("✅ PDA exists:", accountInfo);
        //  toast.success("PDA exists!");
      } else {
        console.log("❌ PDA does not exist.");
        //  toast.error("PDA not found!");
      }

      const [pdaTokenAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("token_account"), pda.toBuffer()],
        PROGRAM_ID
      );


      // ✅ Send Transaction to Unlock Tokens
      const tx = await program.methods.withdrawTokens().accounts({
        user,
        myPda: pda,
        userTokenAccount: userTokenAccount,
        pdaTokenAccount: pdaTokenAccount,
        tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // SPL Token Program
      }).rpc();

      console.log("✅ Transaction Success:", tx);
      toast.success("✅ Tokens successfully withdrawn!");

      //upload to DB
      unlockDB(user)
      console.log("Unlock action submitted!");
      toast.success("Unlock action submitted!");


    } catch (error) {
      console.error("❌ Error withdrawing tokens:", error);

      let errorMessage = "Unlock transaction failed."; // Default message
      let errorText = error.toString();

      if (errorText) {

        // ✅ Extract logs containing our custom error messages
        const knownErrors = [
          "PDA already contains tokens. Withdraw before depositing again.",
          "No tokens available to withdraw.",
          "Tokens are still locked."
        ];

        // ✅ Check if the error message contains one of the known errors
        const extractedError = knownErrors.find(knownError => errorText.includes(knownError));

        if (extractedError) {
          errorMessage = extractedError; // ✅ Display only the matched error message
        }
      }

      toast.error(errorMessage, { autoClose: 5000 });
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
                <h3 style={{ textAlign: 'center', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)', marginBottom: '0px' }}>Welcome to the</h3>
                <h1 style={{ fontSize: '4rem', fontWeight: 'bold', textAlign: 'center', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)', marginTop: '0px' }}>Locking System</h1>
                <p>Earn approximatley 4.3% APY on your Retirement Coin! This will be offered as a 1% return over 3 month terms. Some will pledge to lock their tokens not only for a reward, but to show the strength of our community and their belief in our project! </p>

                {wallet.connected ? (
                  <>
                    <div className="card uni-minting-item uk-card uk-card-medium uk-card-border uk-card-default uk-radius-medium uk-radius-large@m dark:uk-background-white-5">
                      <p className="dark:uk-text-gray-10">Total Locked: {totalLocked ?? "?"} RETIREMENT</p>
                      <p className="dark:uk-text-gray-10">Your Locked: {lockedAmount ?? "?"} RETIREMENT</p>
                      {lockedAmount > 0 && (
                        <p className="dark:uk-text-gray-10">
                          Unlockable at: {unlockTime ? unlockTime : "?"}
                        </p>
                      )}
                    </div>
                    <br></br>
                    <div className="card uni-minting-item uk-card uk-card-medium uk-card-border uk-card-default uk-radius-medium uk-radius-large@m dark:uk-background-white-5">
                      <h2 className="">Lock Management</h2>
                      <p className="dark:uk-text-gray-10"> <b>DISCLAIMER</b>: By proceeding with this deposit, you acknowledge and agree that your tokens will be locked for a period of 3 months (90 days).
                        During this period, you will not be able to withdraw, transfer, or access these funds under any circumstances.
                        This action cannot be reversed, modified, or disputed once confirmed.
                        Please review carefully before proceeding. Only one deposit per wallet can be made. </p>
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
                      <button
                        className="uk-button uk-button-secondary"
                        onClick={gInfo}
                      >
                        Info
                      </button>


                      <button
                        className="uk-button uk-button-secondary"
                        onClick={testF}
                      >
                        Test
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
