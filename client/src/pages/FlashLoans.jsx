import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/forms/Input";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const FlashLoans = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: "",
    token: "ETH",
    purpose: "",
    collateral: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const minAmounts = {
    ETH: 0.1,
    USDC: 1000,
    DAI: 1000,
    WBTC: 0.01,
  };

  const tokens = [
    { symbol: "ETH", name: "Ethereum", balance: "2.5" },
    { symbol: "USDC", name: "USD Coin", balance: "5000" },
    { symbol: "DAI", name: "Dai", balance: "3000" },
    { symbol: "WBTC", name: "Wrapped Bitcoin", balance: "0.15" },
  ];

  const getCurrentTokenBalance = () => {
    const token = tokens.find((t) => t.symbol === formData.token);
    return token ? token.balance : "0";
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Validate amount on change
    if (name === "amount" && value) {
      const numValue = parseFloat(value);
      if (numValue <= 0) {
        setErrors((prev) => ({
          ...prev,
          amount: "Amount must be greater than 0",
        }));
      } else if (numValue < minAmounts[formData.token]) {
        setErrors((prev) => ({
          ...prev,
          amount: `Minimum amount for ${formData.token} is ${
            minAmounts[formData.token]
          }`,
        }));
      }
    }
  };

  const validateForm = () => {
    const errors = [];
    const amount = parseFloat(formData.amount);
    const balance = parseFloat(getCurrentTokenBalance());

    if (!amount || amount <= 0) {
      errors.push("Please enter a valid loan amount greater than 0");
    } else if (amount < minAmounts[formData.token]) {
      errors.push(
        `Minimum amount for ${formData.token} is ${minAmounts[formData.token]}`
      );
    } else if (amount > balance * 3) {
      errors.push(
        `Maximum loan amount is limited to 3x your current balance (${
          balance * 3
        } ${formData.token})`
      );
    }

    if (!formData.purpose.trim()) {
      errors.push("Please specify the purpose of the flash loan");
    } else if (formData.purpose.length < 20) {
      errors.push(
        "Please provide a more detailed purpose for the flash loan (at least 20 characters)"
      );
    }

    if (!formData.collateral.trim()) {
      errors.push("Please describe your collateral strategy");
    } else if (formData.collateral.length < 30) {
      errors.push(
        "Please provide a more detailed collateral strategy (at least 30 characters)"
      );
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to access flash loans");
      return;
    }

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to flash loan smart contract
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Validate amount against token-specific limits
      const minAmounts = {
        ETH: 0.1,
        USDC: 1000,
        DAI: 1000,
        WBTC: 0.01,
      };

      if (parseFloat(formData.amount) < minAmounts[formData.token]) {
        throw new Error(
          `Minimum amount for ${formData.token} is ${
            minAmounts[formData.token]
          }`
        );
      }

      toast.success("Flash loan request submitted successfully!");
      setFormData({
        amount: "",
        token: "ETH",
        purpose: "",
        collateral: "",
      });
    } catch (error) {
      console.error("Flash loan error:", error);
      toast.error(
        error.message ||
          "Failed to process flash loan request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Flash Loans</h1>
          <p className="text-gray-400">
            Access instant decentralized loans for arbitrage opportunities
          </p>
        </div>

        <Card className="mb-8">
          <div className="flex items-start p-4 bg-blue-900/20 rounded-lg mb-6">
            <FiInfo className="text-blue-400 text-xl flex-shrink-0 mt-1" />
            <div className="ml-4">
              <h3 className="text-blue-400 font-semibold">
                What are Flash Loans?
              </h3>
              <p className="text-gray-300 text-sm mt-1">
                Flash loans are special transactions that allow you to borrow
                assets without collateral, as long as the borrowed amount is
                returned within the same transaction block. They're commonly
                used for arbitrage opportunities and collateral swaps.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={`Loan Amount (Min: ${minAmounts[formData.token]} ${
                  formData.token
                })`}
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                min={minAmounts[formData.token]}
                step="0.01"
                placeholder="0.00"
                error={errors.amount}
              />

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Token
                  </label>
                  <span className="text-sm text-gray-400">
                    Balance: {getCurrentTokenBalance()} {formData.token}
                  </span>
                </div>
                <select
                  name="token"
                  value={formData.token}
                  onChange={(e) => {
                    handleChange(e);
                    // Revalidate amount when token changes
                    if (formData.amount) {
                      const numValue = parseFloat(formData.amount);
                      if (numValue < minAmounts[e.target.value]) {
                        setErrors((prev) => ({
                          ...prev,
                          amount: `Minimum amount for ${e.target.value} is ${
                            minAmounts[e.target.value]
                          }`,
                        }));
                      } else {
                        setErrors((prev) => ({ ...prev, amount: "" }));
                      }
                    }
                  }}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.name} ({token.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Input
                label="Purpose"
                name="purpose"
                type="text"
                value={formData.purpose}
                onChange={handleChange}
                required
                placeholder="e.g., Arbitrage between DEXs"
                error={errors.purpose}
              />
              <div className="flex justify-end">
                <span
                  className={`text-xs ${
                    formData.purpose.length < 20
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {formData.purpose.length}/20 characters minimum
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <Input
                label="Collateral Strategy"
                name="collateral"
                type="text"
                value={formData.collateral}
                onChange={handleChange}
                required
                placeholder="Describe your collateral or repayment strategy"
                error={errors.collateral}
              />
              <div className="flex justify-end">
                <span
                  className={`text-xs ${
                    formData.collateral.length < 30
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {formData.collateral.length}/30 characters minimum
                </span>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Processing..." : "Request Flash Loan"}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-white mb-4">
            Flash Loan Requirements
          </h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3" />
              <span>Must repay the loan within the same transaction block</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3" />
              <span>Include a 0.09% fee on the borrowed amount</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3" />
              <span>Have a clear arbitrage or swap strategy</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3" />
              <span>Ensure sufficient gas fees for complex transactions</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default FlashLoans;
