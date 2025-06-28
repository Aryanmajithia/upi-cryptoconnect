import React, { useState, useEffect } from "react";
import {
  useAddress,
  useConnect,
  useDisconnect,
  useBalance,
  useContract,
} from "@thirdweb-dev/react";
import { ConnectWallet, useWallet } from "@thirdweb-dev/react";
import { FiCreditCard, FiCopy, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import Button from "./Button";

const WalletConnect = ({ onWalletConnect, onWalletDisconnect }) => {
  const address = useAddress();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const { data: balance } = useBalance();
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (address && onWalletConnect) {
      onWalletConnect(address);
    }
  }, [address, onWalletConnect]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Wallet connection error:", error);
      if (error.message.includes("Connection request reset")) {
        toast.error(
          "Connection failed. Please try again or check your network."
        );
      } else {
        toast.error("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      if (onWalletDisconnect) {
        onWalletDisconnect();
      }
      toast.success("Wallet disconnected successfully!");
    } catch (error) {
      console.error("Wallet disconnection error:", error);
      toast.error("Failed to disconnect wallet.");
    }
  };

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

  if (address) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FiCreditCard className="text-green-400 text-lg" />
            <span className="text-white font-medium">Connected Wallet</span>
          </div>
          <Button
            onClick={handleDisconnect}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
          >
            Disconnect
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Address:</span>
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm font-mono">
                {formatAddress(address)}
              </span>
              <button
                onClick={copyAddress}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
              </button>
            </div>
          </div>

          {balance && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Balance:</span>
              <span className="text-white text-sm font-medium">
                {parseFloat(balance.displayValue).toFixed(4)} {balance.symbol}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
      <FiCreditCard className="text-gray-400 text-4xl mx-auto mb-4" />
      <h3 className="text-white font-semibold mb-2">Connect Your Wallet</h3>
      <p className="text-gray-400 text-sm mb-4">
        Connect your wallet to access crypto features and manage your digital
        assets.
      </p>
      <ConnectWallet
        theme="dark"
        btnTitle="Connect Wallet"
        modalTitle="Connect to CryptoConnect"
        modalSize="wide"
        welcomeScreen={{
          title: "Welcome to CryptoConnect",
          subtitle: "Connect your wallet to start using crypto payments",
        }}
        modalTitleIconUrl=""
        termsOfServiceUrl=""
        privacyPolicyUrl=""
        onConnect={(wallet) => {
          console.log("Wallet connected:", wallet);
          toast.success("Wallet connected successfully!");
        }}
        onConnectFailure={(error) => {
          console.error("Wallet connection failed:", error);
          if (error.message.includes("Connection request reset")) {
            toast.error(
              "Connection failed. Please try again or check your network."
            );
          } else {
            toast.error("Failed to connect wallet. Please try again.");
          }
        }}
      />
    </div>
  );
};

export default WalletConnect;
