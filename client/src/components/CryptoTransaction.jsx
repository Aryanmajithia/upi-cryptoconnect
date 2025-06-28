import React, { useState, useContext } from "react";
import {
  useAddress,
  useBalance,
  useContract,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import {
  FiSend,
  FiDownload,
  FiCopy,
  FiCheck,
  FiCreditCard,
} from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import Button from "./Button";
import Card from "./Card";

const CryptoTransaction = () => {
  const { user } = useContext(AuthContext);
  const address = useAddress();
  const { data: balance } = useBalance();
  const [activeTab, setActiveTab] = useState("send");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        toast.success("Address copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error("Failed to copy address");
      }
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!amount || !recipient) {
      toast.error("Please fill in all fields");
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    if (parseFloat(amount) > parseFloat(balance?.displayValue || 0)) {
      toast.error("Insufficient balance");
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically use the contract write function
      // For now, we'll simulate the transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Transaction sent successfully!");
      setAmount("");
      setRecipient("");
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!address) {
    return (
      <Card>
        <div className="text-center p-6">
          <FiCreditCard className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">
            Connect Wallet to Send Crypto
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Connect your wallet to start sending and receiving cryptocurrency.
          </p>
          <ConnectWallet
            theme="dark"
            btnTitle="Connect Wallet"
            modalTitle="Connect to CryptoConnect"
          />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("send")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "send"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <FiSend className="inline mr-2" />
          Send
        </button>
        <button
          onClick={() => setActiveTab("receive")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "receive"
              ? "bg-green-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <FiDownload className="inline mr-2" />
          Receive
        </button>
      </div>

      {/* Send Tab */}
      {activeTab === "send" && (
        <Card>
          <h3 className="text-white font-semibold mb-4">Send Crypto</h3>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Amount ({balance?.symbol || "ETH"})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                step="0.0001"
                min="0"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Available: {parseFloat(balance?.displayValue || 0).toFixed(4)}{" "}
                {balance?.symbol || "ETH"}
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                <>
                  <FiSend className="mr-2" />
                  Send Transaction
                </>
              )}
            </Button>
          </form>
        </Card>
      )}

      {/* Receive Tab */}
      {activeTab === "receive" && (
        <Card>
          <h3 className="text-white font-semibold mb-4">Receive Crypto</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Your Wallet Address
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={address}
                  readOnly
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm"
                />
                <button
                  onClick={copyAddress}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
                >
                  {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">QR Code</h4>
              <div className="bg-white rounded-lg p-4 flex items-center justify-center">
                <div className="text-gray-500 text-sm">
                  QR Code for {formatAddress(address)}
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-2">
                Network Information
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-white">Sepolia Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Currency:</span>
                  <span className="text-white">Sepolia ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Chain ID:</span>
                  <span className="text-white">11155111</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <h3 className="text-white font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <FiDownload className="text-white text-sm" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Received</p>
                <p className="text-gray-400 text-xs">0.001 ETH</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-400 text-sm font-medium">+0.001 ETH</p>
              <p className="text-gray-400 text-xs">2 hours ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <FiSend className="text-white text-sm" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Sent</p>
                <p className="text-gray-400 text-xs">0.005 ETH</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-red-400 text-sm font-medium">-0.005 ETH</p>
              <p className="text-gray-400 text-xs">1 day ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CryptoTransaction;
