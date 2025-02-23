import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import WalletButton from "../components/WalletButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletNFTs } from "../hooks/useWalletNFTs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);

  const wallet = useWallet();

  const [totalLocked, setTotalLocked] = useState(0);
  const [amount, setAmount] = useState(0);
  const [lockedAmount, setLockedAmount] = useState(0);
  const [unlockTime, setUnlockTime] = useState(0);
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getUTCFullYear();
      const currentMonth = now.getUTCMonth();
      const targetDate = new Date(Date.UTC(currentYear, currentMonth, 25, 0, 0, 0));


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
    console.log("Locking " + amount)

    
    
    
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
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center'}}>Countdown to the 25th (UTC Time):</h2>
                <h1 style={{ textAlign: 'center' , fontSize: '3rem' }}>{formatTime(timeLeft)}</h1>
                
                <h3 style={{ textAlign: 'center', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' , marginBottom: '0px'}}>Welcome to the</h3>
                <h1 style={{ fontSize: '4rem', fontWeight: 'bold', textAlign: 'center', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)', marginTop: '0px'}}>Locking System</h1>
                <p>Earn approximatley 4.3% APY on your Retirement Coin! This will be offered as a 1% return over 3 month terms. Some will pledge to lock their tokens not only for a reward, but to show the strength of our community and their belief in our project! </p>
                
                {wallet.connected ? (
                <>
                    <div className="card uni-minting-item uk-card uk-card-medium uk-card-border uk-card-default uk-radius-medium uk-radius-large@m dark:uk-background-white-5">
                        <p className="dark:uk-text-gray-10">Total Locked: {totalLocked} RETIREMENT</p>
                        <p className="dark:uk-text-gray-10">Your Locked: {lockedAmount} RETIREMENT</p>
                        
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
