import { useEffect, useState } from "react";
import Layout from "../components/Layout";

import WalletButton from "../components/WalletButton";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletNFTs } from "../hooks/useWalletNFTs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const API_KEY = process.env.NEXT_PUBLIC_DB_API;
  const wallet = useWallet();
  const updateAuthority = "9u48hDfYSQsEuV9mdKaP31dF1CtqSuxL1mqeBY6Mz1CP";
  const { nfts, loading, fetchNFTs } = useWalletNFTs(updateAuthority);

  const [votingPower, setVotingPower] = useState(0);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [voteValue, setVoteValue] = useState(1);

  // Fetch NFTs when wallet connects
  useEffect(() => {
    if (wallet.connected) {
      fetchNFTs(wallet.publicKey.toString());
    }
  }, [wallet.connected]);

  // Calculate voting power (based on NFT count)
  useEffect(() => {
    if (nfts.length > 0) {
      setVotingPower(nfts.length);
    } else {
      setVotingPower(0);
    }
  }, [nfts]);

  // Fetch active voting topics from backend
  const fetchTopics = async () => {
    const response = await fetch("https://retirementcoin.io/get_topics.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY
      }
    });

    const data = await response.json();
    if (data.status === "success") {
      setTopics(data.topics);
    } else {
      console.error("Error fetching topics:", data.message);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Submit vote to backend
  const submitVote = async () => {
    if (!wallet.connected) {
      toast.error("Please connect your wallet first! 🔌");
      return;
    }
    if (!selectedTopic) {
      toast.warning("Select a topic before voting! 🗳️");
      return;
    }

    const response = await fetch("https://retirementcoin.io/cast_vote99.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY
      },
      body: JSON.stringify({
        wallet: wallet.publicKey.toString(),
        topic_id: selectedTopic,
        vote_value: votingPower
      })
    });

    const data = await response.json();
    console.log(data.message)
    //toast.success("✅ " + data.message); // Beautiful success toast
    if (data.status === "success") {
      toast.success("✅ " + data.message); // Beautiful success toast
    } else {
      toast.error("❌ " + data.message); // Error toast
    }
  };

  return (
    <Layout>
      <ToastContainer 
  position="top-right"
  autoClose={3000} // Auto close after 3 seconds
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  pauseOnHover
  draggable
  theme="dark"
/>
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
                <br></br><br></br>
                <h1>Welcome to the Voting System</h1>
                <WalletButton />

                {/* ✅ Topics should always be visible, so move them here */}
                <div className="uk-margin-top">
                  <h3>Active Topics:</h3>
                  <ul>
                    {topics.length > 0 ? (
                      topics.map((topic) => (
                        <li key={topic.id}>
                          <label>
                            <input
                              type="radio"
                              name="voteTopic"
                              value={topic.id}
                              onChange={() => setSelectedTopic(topic.id)}
                            />
                            {topic.title} (Votes: {topic.total_votes})
                          </label>
                        </li>
                      ))
                    ) : (
                      <p>No active topics available.</p>
                    )}
                  </ul>
                </div>

                {/* ✅ Only show wallet-based elements if connected */}
                {wallet.connected && (
                  <>
                    <p><strong>Connected Wallet:</strong> {wallet.publicKey.toString()}</p>
                    <p><strong>Voting Power:</strong> {votingPower} (Based on NFT Holdings)</p>

                    <button
                      className="uk-button uk-button-gradient"
                      onClick={() => fetchNFTs(wallet.publicKey.toString())}
                      disabled={loading}
                    >
                      {loading ? "Loading NFTs..." : "Refresh NFTs"}
                    </button>

                    {/* Voting Form */}
                    <div className="uk-margin-top">
                      <h3>Cast Your Vote:</h3>
                      <button
                        className="uk-button uk-button-primary"
                        onClick={() => submitVote()}
                        disabled={!selectedTopic || votingPower === 0}
                      >
                        Submit Vote
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );

};

export default Home;
