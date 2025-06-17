import React, { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";
import {
  useAddress,
  useConnect,
  useContract,
  useBalance,
} from "@thirdweb-dev/react";
import axios from "axios";

const Loans = () => {
  const [timer, setTimer] = useState(60);
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState("Free");
  const [flash, setFlash] = useState(false);
  const [depositAmt, setDepositAmt] = useState("");
  const [connected, setConnected] = useState(false);
  const [loanAmount, setLoanAmount] = useState("");
  const [foundPair, setFoundPair] = useState("");
  const [estimatedProfit, setEstimatedProfit] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const address = useAddress();
  const connect = useConnect();
  const { contract: usdcContract } = useContract(
    "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8"
  );
  const { data: usdcBalance } = useBalance(usdcContract);

  useEffect(() => {
    if (address) {
      setConnected(true);
      fetchLoanHistory();
      checkBalance();
    }
  }, [address]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 60));
      if (timer === 0) {
        checkBalance();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const fetchLoanHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/loans/history`
      );
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching loan history:", error);
      setError("Failed to fetch loan history");
    } finally {
      setLoading(false);
    }
  };

  const checkBalance = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/loans/balance`
      );
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Error checking balance:", error);
      setError("Failed to check balance");
    }
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/loans/withdraw`
      );
      setStatusMessage("Withdrawal successful");
      checkBalance();
    } catch (error) {
      console.error("Error withdrawing:", error);
      setError("Failed to withdraw");
    } finally {
      setLoading(false);
    }
  };

  const handleArena = async () => {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/loans/lock`);
      setStatus("Locked");
      setStatusMessage("Arena locked successfully");
    } catch (error) {
      console.error("Error locking arena:", error);
      setError("Failed to lock arena");
    } finally {
      setLoading(false);
    }
  };

  const handleFlash = async () => {
    if (!loanAmount || loanAmount <= 0) {
      setError("Please enter a valid loan amount");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("Finding arbitrage opportunity...");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/loans/flash`,
        {
          amount: loanAmount,
        }
      );
      setFoundPair(response.data.pair);
      setEstimatedProfit(response.data.profit);
      setStatusMessage("Arbitrage opportunity found!");
    } catch (error) {
      console.error("Error finding arbitrage:", error);
      setError("Failed to find arbitrage opportunity");
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = async () => {
    if (!foundPair || !estimatedProfit) {
      setError("Please find an arbitrage opportunity first");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/loans/execute`,
        {
          pair: foundPair,
          amount: loanAmount,
        }
      );
      setStatusMessage("Transaction successful!");
      fetchLoanHistory();
      checkBalance();
    } catch (error) {
      console.error("Error executing transaction:", error);
      setError("Failed to execute transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Flash Loans</h1>
        {!connected ? (
          <button
            onClick={connect}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="text-green-500">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-900 text-white p-4 rounded-lg mb-4">{error}</div>
      )}

      {statusMessage && (
        <div className="bg-green-900 text-white p-4 rounded-lg mb-4">
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900 border-zinc-700 border-[1px] p-6 rounded-lg shadow-lg">
          <p className="text-lg">Contract: 0xabc...123</p>
          <p className="text-lg">Status: {status}</p>
          <p className="text-lg">
            Balance: {usdcBalance?.displayValue || 0} USDC
          </p>
        </div>
        <div className="bg-zinc-900 border-zinc-700 border-[1px] p-6 rounded-lg shadow-lg">
          <p className="text-lg">Timer: {timer}s</p>
          <button
            onClick={handleWithdraw}
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? "Processing..." : "Withdraw"}
          </button>
          <button
            onClick={handleArena}
            disabled={loading}
            className="mt-4 ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? "Processing..." : "Lock Arena"}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <label className="block mb-3 text-xl">Loan Amount (USDC)</label>
        <input
          type="number"
          className="w-full p-3 rounded-lg border-zinc-700 border-[1px] bg-zinc-800 text-white"
          placeholder="Enter amount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <button
          onClick={handleFlash}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
        >
          {loading ? "Processing..." : "FLASH!"}
        </button>
      </div>

      {foundPair && (
        <div className="bg-zinc-900 border-zinc-700 border-[1px] p-6 rounded-lg shadow-lg mb-8">
          <div className="flex items-center mt-6">
            <p className="mr-3">Found Pair:</p>
            <div className="bg-zinc-800 border-zinc-700 border-[1px] p-3 rounded-lg">
              {foundPair}
            </div>
          </div>
          <div className="flex items-center mt-6">
            <p className="mr-3">Estimated Profit:</p>
            <div className="bg-zinc-800 border-zinc-700 border-[1px] p-3 rounded-lg">
              {estimatedProfit}
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleProceed}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
            >
              {loading ? "Processing..." : "Proceed"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">History</h2>
        {loading ? (
          <div className="text-center">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="text-center">No transactions yet</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b-2 border-zinc-700 text-2xl font-light text-zinc-500 p-3">
                  Date
                </th>
                <th className="border-b-2 border-zinc-700 text-2xl font-light text-zinc-500 p-3">
                  Token
                </th>
                <th className="border-b-2 border-zinc-700 text-2xl font-light text-zinc-500 p-3">
                  Loan
                </th>
                <th className="border-b-2 border-zinc-700 text-2xl font-light text-zinc-500 p-3">
                  P/L
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => (
                <tr key={index}>
                  <td className="border-b border-zinc-700 p-3">{entry.date}</td>
                  <td className="border-b border-zinc-700 p-3">
                    {entry.token}
                  </td>
                  <td className="border-b border-zinc-700 text-yellow-500 p-3">
                    {entry.loan}
                  </td>
                  <td className="border-b border-zinc-700 p-3 text-green-500">
                    <div className="flex">
                      <FiArrowUp size={24} />
                      <div>{entry.pl}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Loans;
