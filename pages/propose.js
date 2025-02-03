import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletNFTs } from "../hooks/useWalletNFTs";
import { useEffect } from "react";


const Home = () => {

    const wallet = useWallet();
    const updateAuthority = "9u48hDfYSQsEuV9mdKaP31dF1CtqSuxL1mqeBY6Mz1CP";
    const { nfts, loading, fetchNFTs } = useWalletNFTs(updateAuthority);
    const [votingPower, setVotingPower] = useState(0);

    useEffect(() => {
        if (wallet.connected) {
            fetchNFTs(wallet.publicKey.toString());
        }
    }, [wallet.connected]);

    // Calculate voting power based on NFT count
    useEffect(() => {
        setVotingPower(nfts.length > 0 ? nfts.length : 0);
    }, [nfts]);


    const API_KEY = process.env.NEXT_PUBLIC_DB_API;
    const router = useRouter();

    // State for topic title and options
    const [topicTitle, setTopicTitle] = useState("");
    const [options, setOptions] = useState([""]); // Start with 1 option

    // Function to add an option (max 5)
    const addOption = () => {
        if (options.length < 5) {
            setOptions([...options, ""]);
        } else {
            toast.warning("Maximum of 5 options allowed.");
        }
    };

    // Function to remove an option
    const removeOption = (index) => {
        if (options.length > 1) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    // Function to update an option text
    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    // Submit proposal
    const submitProposal = async () => {
        if(votingPower <= 0){
            return;
        }

        if (!topicTitle.trim()) {
            toast.error("Topic title is required.");
            return;
        }
        if (options.some((opt) => !opt.trim())) {
            toast.error("All options must be filled.");
            return;
        }

        const response = await fetch("https://retirementcoin.io/propose_vote.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY,
            },
            body: JSON.stringify({
                topic_title: topicTitle,
                options: options,
            }),
        });

        const data = await response.json();
        if (data.status === "success") {
            toast.success("Vote proposed successfully!");
            router.push("/vote"); // Redirect to home or voting page
        } else {
            toast.error(data.message);
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
                            <div className="uk-container uk-margin-top">
                                <h2>Propose a New Vote</h2>

                                {/* Topic Title */}
                                <div className="uk-margin">
                                    <label className="uk-form-label">Topic Title:</label>
                                    <input
                                        type="text"
                                        className="uk-input"
                                        value={topicTitle}
                                        onChange={(e) => setTopicTitle(e.target.value)}
                                        placeholder="Enter topic title..."
                                    />
                                </div>

                                {/* Options List */}
                                <div className="uk-margin">
                                    <label className="uk-form-label">Options:</label>
                                    {options.map((option, index) => (
                                        <div key={index} className="uk-flex uk-flex-middle uk-margin-small">
                                            <input
                                                type="text"
                                                className="uk-input uk-width-expand"
                                                value={option}
                                                onChange={(e) => updateOption(index, e.target.value)}
                                                placeholder={`Option ${index + 1}`}
                                            />
                                            {options.length > 1 && (
                                                <button className="uk-button uk-button-danger uk-margin-left" onClick={() => removeOption(index)}>
                                                    ✖
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    {/* Add Option Button */}
                                    {options.length < 5 && (
                                        <button className="uk-button uk-button-secondary uk-margin-top" onClick={addOption}>
                                            ➕ Add Option
                                        </button>
                                    )}
                                </div>

                                {
                                    votingPower > 0 ? (<button className="uk-button uk-button-primary uk-margin-top" onClick={submitProposal}>
                                        Submit Proposal
                                    </button>)
                                        : (
                                            <p className="uk-text-danger uk-margin-top">Wallet not connected / No NFT</p>
                                        )
                                }
                                {/* Submit Button */}

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>


    );
};

export default Home;
