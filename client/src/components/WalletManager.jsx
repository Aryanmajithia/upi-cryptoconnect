import React, { useState, useEffect, useContext } from "react";
import {
  useAddress,
  useBalance,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import {
  FiCreditCard,
  FiSend,
  FiDownload,
  FiCopy,
  FiCheck,
  FiRefreshCw,
} from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import Button from "./Button";
import Card from "./Card";
import api from "../utils/api";

const WalletManager = () => {
  const { user, updateUser } = useContext(AuthContext);
  const address = useAddress();
  const { data: balance, isLoading: balanceLoading } = useBalance();
  const [copied, setCopied] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    if (address && user && address !== user.walletAddress) {
      updateWalletInProfile(address);
    }
  }, [address, user]);

  const updateWalletInProfile = async (walletAddress) => {
    setIsUpdatingProfile(true);
    try {
      console.log("Updating wallet in profile:", { walletAddress });

      const response = await api.put(`/api/auth/update-profile`, {
        walletAddress: walletAddress,
      });

      console.log("Profile update response:", response.data);
      updateUser(response.data.user);
      toast.success("Wallet connected to your profile!");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 404) {
        toast.error(
          "Profile update endpoint not found. Please check server configuration."
        );
      } else {
        toast.error(
          `Failed to link wallet: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        toast.success("Wallet address copied to clipboard!");
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

  const formatBalance = (balance) => {
    if (!balance) return "0.0000";
    return parseFloat(balance.displayValue).toFixed(4);
  };

  const refreshBalance = () => {
    // This will trigger a re-fetch of the balance
    window.location.reload();
  };

  if (!address) {
    return (
      <Card>
        <div className="text-center p-6">
          <FiCreditCard className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-gray-400 text-sm mb-4">
            Connect your wallet to access crypto features and manage your
            digital assets.
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
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Wallet Info Card */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FiCreditCard className="text-green-400 text-xl" />
            <div>
              <h3 className="text-white font-semibold">Connected Wallet</h3>
              <p className="text-gray-400 text-sm">Ethereum Network</p>
            </div>
          </div>
          <button
            onClick={refreshBalance}
            disabled={balanceLoading}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiRefreshCw
              className={`text-lg ${balanceLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="space-y-3">
          {/* Address */}
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
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

          {/* Balance */}
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <span className="text-gray-400 text-sm">Balance:</span>
            <span className="text-white font-semibold">
              {balanceLoading ? (
                <div className="animate-pulse bg-gray-600 h-4 w-20 rounded"></div>
              ) : (
                `${formatBalance(balance)} ${balance?.symbol || "ETH"}`
              )}
            </span>
          </div>

          {/* Profile Connection Status */}
          {user && (
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <span className="text-gray-400 text-sm">Profile Status:</span>
              <span
                className={`text-sm font-medium ${
                  user.walletAddress === address
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {user.walletAddress === address ? "Connected" : "Connecting..."}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <FiSend className="mr-2" />
            Send
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <FiDownload className="mr-2" />
            Receive
          </Button>
        </div>
      </Card>

      {/* Network Info */}
      <Card>
        <h3 className="text-white font-semibold mb-4">Network Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Network:</span>
            <span className="text-white">Sepolia Testnet</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Chain ID:</span>
            <span className="text-white">11155111</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Currency:</span>
            <span className="text-white">Sepolia ETH</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletManager;
