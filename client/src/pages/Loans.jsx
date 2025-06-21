import React, { useState, useEffect } from "react";
import {
  useAddress,
  useConnect,
  useContract,
  useBalance,
} from "@thirdweb-dev/react";
import axios from "axios";
import Layout from "../components/Layout";
import LoanStatus from "../components/Loan/LoanStatus";
import LoanForm from "../components/Loan/LoanForm";
import ArbitrageDetails from "../components/Loan/ArbitrageDetails";
import LoanHistory from "../components/Loan/LoanHistory";
import Button from "../components/Button";

const Loans = () => {
  const [timer, setTimer] = useState(60);
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState("Free");
  const [loanAmount, setLoanAmount] = useState("");
  const [foundPair, setFoundPair] = useState("");
  const [estimatedProfit, setEstimatedProfit] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");

  const address = useAddress();
  const connect = useConnect();
  const { contract: usdcContract } = useContract(
    "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8"
  );
  const { data: usdcBalance } = useBalance(usdcContract);

  useEffect(() => {
    if (address) {
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
      setHistoryLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/loans/history`
      );
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching loan history:", error);
      setHistoryError("Failed to fetch loan history");
    } finally {
      setHistoryLoading(false);
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
      setError("");
      setStatusMessage("Finding arbitrage opportunity...");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/loans/flash`,
        { amount: loanAmount }
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
        { pair: foundPair, amount: loanAmount }
      );
      setStatusMessage("Transaction successful!");
      fetchLoanHistory();
      checkBalance();
      setFoundPair("");
      setEstimatedProfit("");
    } catch (error) {
      console.error("Error executing transaction:", error);
      setError("Failed to execute transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Flash Loans</h1>
            {!address ? (
              <Button onClick={connect}>Connect Wallet</Button>
            ) : (
              <div className="text-sm"></div>
            )}
          </header>

          {error && (
            <div className="bg-red-900 bg-opacity-50 text-red-300 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}
          {statusMessage && (
            <div className="bg-green-900 bg-opacity-50 text-green-300 p-4 rounded-lg mb-4">
              {statusMessage}
            </div>
          )}

          <div className="space-y-8">
            <LoanStatus
              address={address}
              balance={usdcBalance?.displayValue || "0"}
              status={status}
              timer={timer}
              onWithdraw={handleWithdraw}
              onLockArena={handleArena}
              loading={loading}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <LoanForm
                loanAmount={loanAmount}
                setLoanAmount={setLoanAmount}
                onFlash={handleFlash}
                loading={loading}
              />
              {foundPair && (
                <ArbitrageDetails
                  pair={foundPair}
                  profit={estimatedProfit}
                  onProceed={handleProceed}
                  loading={loading}
                />
              )}
            </div>

            <LoanHistory
              history={history}
              loading={historyLoading}
              error={historyError}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Loans;
