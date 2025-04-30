import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import PollFeedbackABI from "../abi/poolFeedbackABI.json";
import { CONTRACT_ADDRESS } from "../constants";
import toast from "react-hot-toast";

export const EthContext = createContext();

export const EthProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");

  useEffect(() => {
    connectWallet();
  }, []);
  const disconnectWallet = async () => {
    if (window.ethereum) {
      setConnectButtonText("Connect Wallet");
      setProvider(null);
      setSigner(null);
      setContract(null);
      setAccount(null);
    } else {
      toast.error("Please install MetaMask to use this feature.");
    }
  };
  const connectWallet = async () => {
    if (window.ethereum) {
      setConnectButtonText("Connecting...");
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(tempProvider);

        const tempSigner = await tempProvider.getSigner(0);
        setSigner(tempSigner);

        const userAddress = await tempSigner.getAddress();
        setAccount(userAddress);

        const pollFeedbackContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          PollFeedbackABI,
          tempSigner
        );
        setContract(pollFeedbackContract);
        setConnectButtonText("Connected");
      } catch (error) {
        toast.error("Error connecting to MetaMask. Please try again.");
        setConnectButtonText("Connect Wallet");
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      toast.error("Please install MetaMask to use this feature.");
      setConnectButtonText("Install MetaMask");
    }
  };

  return (
    <EthContext.Provider
      value={{
        provider,
        signer,
        contract,
        account,
        connectButtonText,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </EthContext.Provider>
  );
};
