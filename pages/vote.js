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

  const API_KEY = process.env.NEXT_PUBLIC_DB_API;
  const wallet = useWallet();
  const updateAuthority = "9u48hDfYSQsEuV9mdKaP31dF1CtqSuxL1mqeBY6Mz1CP";
  const { nfts, loading, fetchNFTs } = useWalletNFTs(updateAuthority);

  const [votingPower, setVotingPower] = useState(0);
  const [topics, setTopics] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [expandedTopic, setExpandedTopic] = useState(null);

  const toggleTopic = (topicId) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId); // Toggle the selected topic
  };

  // Fetch NFTs when wallet connects
  useEffect(() => {
    if (wallet.connected) {
      fetchNFTs(wallet.publicKey.toString());
    }
  }, [wallet.connected]);

  // Calculate voting power based on NFT count
  useEffect(() => {
    setVotingPower(nfts.length > 0 ? nfts.length : 0);
  }, [nfts]);

  // Fetch topics with options and vote counts
  const fetchTopics = async () => {
    const response = await fetch("https://retirementcoin.io/get_topics2.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    });

    const data = await response.json();

    if (data.status === "success") {
      const processedTopics = data.topics.map((topic) => {
        const totalVotes = topic.options.reduce((sum, opt) => sum + parseInt(opt.total_votes, 10), 0);
        return {
          ...topic,
          totalVotes,
          options: topic.options.map((opt) => ({
            ...opt,
            percentage: totalVotes > 0 ? (opt.total_votes / totalVotes) * 100 : 0,
          })),
        };
      });

      setTopics(processedTopics);
    } else {
      console.error("Error fetching topics:", data.message);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Submit vote for an option
  const submitVote = async () => {
    if (!wallet.connected) {
      toast.error("Please connect your wallet first!");
      return;
    }
    if (!selectedOption) {
      toast.warning("Select an option before voting!");
      return;
    }

    setIsSubmitting(true);
    const response = await fetch("https://retirementcoin.io/cast_vote2.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
      body: JSON.stringify({
        wallet: wallet.publicKey.toString(),
        option_id: selectedOption,
        vote_value: votingPower,
      }),
    });

    const data = await response.json();
    toast[data.status === "success" ? "success" : "error"](data.message);
    fetchTopics(); // Refresh votes
    setIsSubmitting(false);
  };

  // Retract vote for an option
  const retractVote = async () => {
    if (!wallet.connected) {
      toast.error("Please connect your wallet first!");
      return;
    }
    if (!selectedOption) {
      toast.warning("Select an option to retract your vote from!");
      return;
    }

    setIsSubmitting(true);
    const response = await fetch("https://retirementcoin.io/retract_vote2.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
      body: JSON.stringify({
        wallet: wallet.publicKey.toString(),
        option_id: selectedOption,
      }),
    });

    const data = await response.json();
    toast[data.status === "success" ? "success" : "error"](data.message);
    fetchTopics(); // Refresh votes
    setIsSubmitting(false);
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
                <h1>Welcome to the <span className="uk-text-gradient" data-text="Voting System">Voting System</span></h1>
                <div className="uk-flex uk-flex-wrap uk-flex-center uk-width-1-1">
                <button className="uk-button uk-button-large@m uk-button-gradient buttMarg"><WalletButton />  </button>
                <button
                      className="uk-button uk-button-large@m uk-button-gradient buttMarg"
                      onClick={() => router.push("/propose")}
                    >
                      Propose Topic
                    </button></div>

                <div className="uk-margin-top">
                  <h3>Active Topics:</h3>


                  {topics.length > 0 ? (
                    topics.map((topic) => (




                      <div key={topic.topic_id} className="uk-margin-bottom">


                        {/* topic and dropdown button */}
                        <div class="topic-container">
                        
                        <button
                          className="uk-button uk-button-secondary "
                          onClick={() => toggleTopic(topic.topic_id)}
                        >
                          <span class="material-icons">
                            {expandedTopic === topic.topic_id ? "expand_less" : "expand_more"}
                          </span>
                          {expandedTopic === topic.topic_id ? "Hide Topic" : "Show Topic"} 
                        </button>
                        <span class="topic-text">{"("}{topic.title}{")"}</span>
                        
                        </div>

                        {expandedTopic === topic.topic_id && (

                          
                            topic.options.map((option) => (


                              <div key={option.option_id} className="uk-margin-small">
                                <label>
                                  {/*disabled={isExpired}*/}
                                  <input
                                    type="checkbox"
                                    className="custom-checkbox"

                                    checked={selectedOption === option.option_id}
                                    onChange={() => setSelectedOption(option.option_id)}
                                  />

                                  {option.option_title} (Votes: {option.total_votes}) <span className="uk-text-small">{option.percentage.toFixed(1)}%</span>
                                </label>

                                <progress className="uk-progress custom-orange-progress" value={option.percentage} max="100"></progress>
                                
                              </div>

                            ))
                          

                        )}

                        
                      </div>
                    ))
                  ) : (
                    <p>No active topics available.</p>
                  )}
                </div>

                {wallet.connected && (
                  <>
                    <p>
                      <strong>Connected Wallet:</strong> {wallet.publicKey.toString()}
                    </p>
                    <p>
                      <strong>Voting Power:</strong> {votingPower} (Based on NFT Holdings)
                    </p>

                    <button className="uk-button uk-button-primary" onClick={submitVote} disabled={isSubmitting || !selectedOption || votingPower === 0}>
                      Submit Vote
                    </button>

                    <button className="uk-button uk-button-danger uk-margin-left" onClick={retractVote} disabled={isSubmitting || !selectedOption}>
                      Retract Vote
                    </button>
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
