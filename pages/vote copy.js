import { useEffect, useState } from "react";
import Layout from "../components/Layout";

import WalletButton from "../components/WalletButton";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletNFTs } from "../hooks/useWalletNFTs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { totalmem } from "os";

const Home = () => {
  const API_KEY = process.env.NEXT_PUBLIC_DB_API;
  const wallet = useWallet();
  const updateAuthority = "9u48hDfYSQsEuV9mdKaP31dF1CtqSuxL1mqeBY6Mz1CP";
  const { nfts, loading, fetchNFTs } = useWalletNFTs(updateAuthority);

  const [votingPower, setVotingPower] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [voteValue, setVoteValue] = useState(1);


  const [isSubmitting, setIsSubmitting] = useState(false); // Track button state

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


      let total = 0;
      // Calculate total votes across all topics
      data.topics.forEach(topic => {
        total += parseInt(topic.total_votes, 10) || 0; // Assuming API returns `total_votes` per topic
      });
      setTotalVotes(total); // Store total votes in state


      // Add percentage to each topic
      data.topics.forEach(topic => {
        //console.log(topic.totalVotes, total)
        topic.percentage = total > 0 ? (topic.total_votes / total) * 100 : 0;
      });

      //setTopics(data.topics);
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
    setIsSubmitting(true); // Disable button while processing

    setTimeout(() => {
      setIsSubmitting(false); // Re-enable button after 300ms
    }, 300);

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
    } else if (data.status === "warn") {
      toast.warning(data.message);
    } else {
      toast.error("❌ " + data.message); // Error toast
    }
    fetchTopics();
  };


  // Retract vote from backend
  const retractVote = async () => {
    setIsSubmitting(true); // Disable button while processing

    setTimeout(() => {
      setIsSubmitting(false); // Re-enable button after 300ms
    }, 300);

    if (!wallet.connected) {
      toast.error("Please connect your wallet first! 🔌");
      return;
    }
    if (!selectedTopic) {
      toast.warning("Select a topic to retract vote from! 🗳️");
      return;
    }

    const response = await fetch("https://retirementcoin.io/retract_vote.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY
      },
      body: JSON.stringify({
        wallet: wallet.publicKey.toString(),
        topic_id: selectedTopic
      })
    });

    const data = await response.json();
    console.log(data.message);

    if (data.status === "success") {
      toast.success("✅ " + data.message);
    } else {
      toast.error("❌ " + data.message);
    }

    fetchTopics(); // Refresh topics after retracting vote
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
                      topics.map((topic, index) => {
                        

                        const createdDateUTC = new Date(topic.created_at + " UTC-5"); // Convert from Eastern Time to UTC
                        const expirationDate = new Date(createdDateUTC.getTime() + 12 * 60 * 60 * 1000); // Add 12 hours

                        const nowLocal = new Date(); // Get current time
                        const nowUTC = new Date(Date.UTC(
                          nowLocal.getUTCFullYear(),
                          nowLocal.getUTCMonth(),
                          nowLocal.getUTCDate(),
                          nowLocal.getUTCHours(),
                          nowLocal.getUTCMinutes(),
                          nowLocal.getUTCSeconds()
                        ));

                        // Calculate remaining time
                        const timeDiff = expirationDate - nowUTC; // Milliseconds difference
                        const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60)); // Convert to hours
                        const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes
                        const isExpired = timeDiff <= 0; // Check if expired

                        return (
                          <div key={topic.id}>
                            {/* Time Remaining */}
                            {timeDiff > 0 ? (
                              <p className="uk-text-warning">
                                Expires in: {hoursLeft}h {minutesLeft}m
                              </p>
                            ) : (
                              <p className="uk-text-warning">Expired</p>
                            )}

                            <label>

                              <h3>{topic.title}</h3>
                              <input
                                type="checkbox"
                                className="custom-checkbox"
                                disabled={isExpired}
                                checked={selectedTopic === topic.id}
                                onChange={() => setSelectedTopic(topic.id)}
                              />
                              (Votes: {topic.total_votes})
                            </label>

                            <progress
                              className="uk-progress custom-orange-progress"
                              value={topic.percentage}
                              max="100"
                            ></progress>

                            <span className="uk-text-small">{topic.percentage.toFixed(1)}%</span>

                            {/* Divider between topics, but NOT after the last one */}
                            {index < topics.length - 1 && (
                              <img className="uk-width-2xsmall uk-flex-center uk-margin-auto uk-margin-medium uk-margin-large@m"
                                src="assets/images/divider-01.svg" alt="Divider"
                                data-anime="opacity:[0, 1]; translateY:[24, 0]; onview: true; delay: 100;">
                              </img>
                            )}

                          </div>
                        );
                      })
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
                        //disabled={!selectedTopic || votingPower === 0}
                        disabled={isSubmitting || !selectedTopic || votingPower === 0}
                      >
                        Submit Vote
                      </button>

                      <button
                        className="uk-button uk-button-primary uk-margin-left"
                        onClick={() => retractVote()}
                        disabled={isSubmitting || !selectedTopic || votingPower === 0}
                      >
                        Retract Vote
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
