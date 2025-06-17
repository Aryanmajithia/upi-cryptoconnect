import React, { useState, useEffect } from "react";
import "../index.css";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useTransferToken,
} from "@thirdweb-dev/react";
import axios from "axios";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";

const UPI = () => {
  const [upi, setUpi] = useState("");
  const [option, setOption] = useState("");
  const [amount, setAmount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  const walletAddress = useAddress();
  const { contract: usdcToken } = useContract(
    "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8"
  );
  const { mutateAsync: transferUSDC, isLoading: loadingTransferUSDC } =
    useTransferToken(usdcToken);
  const { contract: daiToken } = useContract(
    "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357"
  );
  const { mutateAsync: transferDAI, isLoading: loadingTransferDAI } =
    useTransferToken(daiToken);

  const validateInputs = () => {
    if (!upi) {
      setError("Please enter a valid UPI ID");
      return false;
    }
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return false;
    }
    if (!option) {
      setError("Please select a token");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");
      setStatus("Processing payment...");

      // Check if wallet is connected
      if (!walletAddress) {
        setError("Please connect your wallet first");
        return;
      }

      // Validate inputs
      if (!validateInputs()) {
        return;
      }

      // Get receiver's wallet address
      const receiverRes = await axios.post(
        "http://localhost:6900/api/auth/fetchdetail",
        { upi }
      );

      if (!receiverRes.data || !receiverRes.data.metamaskId) {
        setError("Invalid UPI ID or receiver not found");
        return;
      }

      const receiverAddress = receiverRes.data.metamaskId;
      const transferAmount = amount * 10 ** 6; // Convert to wei

      setTransactionDetails({
        to: upi,
        amount,
        token: option,
        receiverAddress,
        transferAmount,
      });
      setShowConfirmation(true);
    } catch (error) {
      console.error("Payment error:", error);
      setError("Payment failed. Please try again.");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async () => {
    try {
      setLoading(true);
      setError("");
      setShowConfirmation(false);

      // Process token transfer
      if (transactionDetails.token === "USDC") {
        await transferUSDC({
          to: transactionDetails.receiverAddress,
          amount: transactionDetails.transferAmount.toString(),
        });
      } else if (transactionDetails.token === "DAI") {
        await transferDAI({
          to: transactionDetails.receiverAddress,
          amount: transactionDetails.transferAmount.toString(),
        });
      }

      // Record transaction
      await axios.post("http://localhost:6900/pay/paymentWrite", {
        date: new Date().toISOString(),
        to: transactionDetails.to,
        amt: transactionDetails.amount,
        sender: walletAddress,
        keyword,
        coin: transactionDetails.token,
      });

      setSuccess("Payment successful!");
      setUpi("");
      setAmount(0);
      setKeyword("");
      setOption("");
      setTransactionDetails(null);
    } catch (error) {
      console.error("Payment error:", error);
      setError("Payment failed. Please try again.");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-boxbg flex flex-col justify-between w-1/4 h-3/5 rounded-lg p-5 mt-20 border">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="UPI Id"
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
          className="p-4 bg-neutral-700 outline-none rounded-md"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="p-4 bg-neutral-700 outline-none rounded-md"
        />
        <select
          value={option}
          onChange={(e) => setOption(e.target.value)}
          className="p-4 bg-neutral-700 outline-none rounded-md"
        >
          <option value="">Select Token</option>
          <option value="USDC">USDC</option>
          <option value="DAI">DAI</option>
        </select>
        <input
          type="text"
          placeholder="Keyword (optional)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="p-4 bg-neutral-700 outline-none rounded-md"
        />
      </div>

      <div className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg flex items-center">
            <FiAlertCircle className="mr-2" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500 text-white p-4 rounded-lg flex items-center">
            <FiCheckCircle className="mr-2" />
            {success}
          </div>
        )}
        {status && (
          <div className="bg-blue-500 text-white p-4 rounded-lg flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {status}
          </div>
        )}
        <button
          onClick={handlePayment}
          disabled={loading || loadingTransferUSDC || loadingTransferDAI}
          className="bg-blue-500 text-white p-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            "Send Payment"
          )}
        </button>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-boxbg p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Payment</h3>
            <div className="mb-4">
              <p className="mb-2">To: {transactionDetails?.to}</p>
              <p className="mb-2">
                Amount: {transactionDetails?.amount} {transactionDetails?.token}
              </p>
              <p className="mb-2">
                Receiver Address: {transactionDetails?.receiverAddress}
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UPI;
