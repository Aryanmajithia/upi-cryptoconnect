import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { axis, hdfc, icici, pnb, sbi1 } from "../assets";
import Card from "../components/Card";
import Input from "../components/forms/Input";
import Button from "../components/Button";
import {
  FiCreditCard,
  FiSend,
  FiDownload,
  FiClock,
  FiGrid,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const banks = [
  {
    name: "State Bank of India",
    description:
      "State Bank of India is the largest public sector bank in India.",
    logo: sbi1,
    upiHandle: "@sbi",
  },
  {
    name: "Punjab National Bank",
    description:
      "Punjab National Bank is a leading public sector bank in India.",
    logo: pnb,
    upiHandle: "@pnb",
  },
  {
    name: "HDFC Bank",
    description: "HDFC Bank is a major private sector bank in India.",
    logo: hdfc,
    upiHandle: "@hdfcbank",
  },
  {
    name: "ICICI Bank",
    description: "ICICI Bank is a prominent private sector bank in India.",
    logo: icici,
    upiHandle: "@icici",
  },
  {
    name: "Axis Bank",
    description: "Axis Bank is a well-known private sector bank in India.",
    logo: axis,
    upiHandle: "@axisbank",
  },
];

const Bank = () => {
  const { user } = useAuth();
  const [selectedBank, setSelectedBank] = useState(null);
  const [activeTab, setActiveTab] = useState("link");
  const [togglebox, setTogglebox] = useState(false);
  const [upiId, setUPI] = useState("");
  const [metamaskId, setMetamaskId] = useState("");
  const [bid, setBid] = useState("");
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ifscCode: "",
    accountHolder: "",
    accountAddress: "",
    accountType: "",
    amount: 0,
  });

  const [upiTransaction, setUpiTransaction] = useState({
    amount: "",
    recipientUPI: "",
    note: "",
  });

  useEffect(() => {
    // Load user's bank details if available
    if (user?.bankDetails) {
      setUPI(user.bankDetails.upiId || "");
      setMetamaskId(user.bankDetails.metamaskId || "");
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUPIInputChange = (e) => {
    setUpiTransaction({ ...upiTransaction, [e.target.name]: e.target.value });
  };

  const handleBankSelection = (bank) => {
    setSelectedBank(bank);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`/bank/add`, {
        ...formData,
        bankName: selectedBank.name,
      });
      const a = await res.data.upiId;
      const b = await res.data.id;
      setUPI(a);
      setTogglebox(true);
      setBid(b);
      setActiveTab("kyc");
    } catch (error) {
      console.log(error);
      alert("Error adding bank details");
    } finally {
      setLoading(false);
    }
  };

  const kycHandler = async () => {
    setLoading(true);
    try {
      const links = await api.post(`/bank/linking`, {
        upi: upiId,
        metamask: metamaskId,
        bid: bid,
      });
      console.log(links);
      setTogglebox(false);
      setActiveTab("dashboard");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUPISend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/bank/upi-send", upiTransaction);
      if (response.data.success) {
        alert("UPI transaction successful!");
        setUpiTransaction({ amount: "", recipientUPI: "", note: "" });
        // Refresh transactions
        loadTransactions();
      }
    } catch (error) {
      console.error("UPI transaction failed:", error);
      alert("UPI transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await api.get("/bank/transactions");
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateUPIQR = () => {
    const upiUrl = `upi://pay?pa=${upiId}&pn=${user?.firstName || "User"}&am=${
      upiTransaction.amount
    }&tn=${upiTransaction.note}`;
    return upiUrl;
  };

  useEffect(() => {
    if (activeTab === "transactions") {
      loadTransactions();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-primary py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bank & UPI Services
          </h1>
          <p className="text-gray-400">
            Link your bank account and manage UPI transactions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab("link")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "link"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiCreditCard className="inline mr-2" />
            Link Bank
          </button>
          <button
            onClick={() => setActiveTab("upi")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "upi"
                ? "bg-green-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiSend className="inline mr-2" />
            UPI Send
          </button>
          <button
            onClick={() => setActiveTab("receive")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "receive"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiDownload className="inline mr-2" />
            UPI Receive
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "transactions"
                ? "bg-orange-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiClock className="inline mr-2" />
            Transactions
          </button>
        </div>

        {/* Link Bank Tab */}
        {activeTab === "link" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h2 className="text-2xl font-bold mb-6 text-white">
                Select Your Bank
              </h2>
              <div className="space-y-4">
                {banks.map((bank) => (
                  <button
                    key={bank.name}
                    onClick={() => handleBankSelection(bank)}
                    className={`w-full py-4 px-4 rounded-lg transition-colors flex items-center ${
                      selectedBank?.name === bank.name
                        ? "bg-blue-gradient"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      className="h-10 w-10 mr-4 rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-semibold">{bank.name}</div>
                      <div className="text-sm text-gray-300">
                        {bank.upiHandle}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              {selectedBank ? (
                <>
                  <h2 className="text-2xl font-bold mb-2 text-white">
                    {selectedBank.name}
                  </h2>
                  <p className="text-gray-400 mb-6">
                    {selectedBank.description}
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="IFSC Code"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Account Holder"
                      name="accountHolder"
                      value={formData.accountHolder}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Account Address"
                      name="accountAddress"
                      value={formData.accountAddress}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Account Type"
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Processing..." : "Next"}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-center text-gray-500">
                    Please select a bank to continue.
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* UPI Send Tab */}
        {activeTab === "upi" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h2 className="text-2xl font-bold mb-6 text-white">
                Send Money via UPI
              </h2>
              <form onSubmit={handleUPISend} className="space-y-4">
                <Input
                  label="Recipient UPI ID"
                  name="recipientUPI"
                  value={upiTransaction.recipientUPI}
                  onChange={handleUPIInputChange}
                  placeholder="example@bank"
                  required
                />
                <Input
                  label="Amount"
                  name="amount"
                  type="number"
                  value={upiTransaction.amount}
                  onChange={handleUPIInputChange}
                  placeholder="Enter amount"
                  required
                />
                <Input
                  label="Note (Optional)"
                  name="note"
                  value={upiTransaction.note}
                  onChange={handleUPIInputChange}
                  placeholder="Payment for..."
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processing..." : "Send Money"}
                </Button>
              </form>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold mb-6 text-white">
                Your UPI ID
              </h2>
              {upiId ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-mono text-lg">
                        {upiId}
                      </span>
                      <button
                        onClick={() => copyToClipboard(upiId)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {copied ? <FiCheck /> : <FiCopy />}
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-48 h-48 bg-white mx-auto rounded-lg flex items-center justify-center">
                      <FiGrid className="text-6xl text-gray-800" />
                    </div>
                    <p className="text-gray-400 mt-2">Scan to pay</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No UPI ID linked yet</p>
                  <Button
                    onClick={() => setActiveTab("link")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Link Bank Account
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* UPI Receive Tab */}
        {activeTab === "receive" && (
          <Card>
            <h2 className="text-2xl font-bold mb-6 text-white">
              Receive Money
            </h2>
            {upiId ? (
              <div className="text-center space-y-6">
                <div className="p-6 bg-gray-800 rounded-lg max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Your UPI ID
                  </h3>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-white font-mono text-xl">
                      {upiId}
                    </span>
                    <button
                      onClick={() => copyToClipboard(upiId)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {copied ? <FiCheck /> : <FiCopy />}
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Share this UPI ID to receive payments
                  </p>
                </div>

                <div className="w-64 h-64 bg-white mx-auto rounded-lg flex items-center justify-center">
                  <FiGrid className="text-8xl text-gray-800" />
                </div>

                <div className="space-y-2">
                  <p className="text-white font-medium">
                    How to receive money:
                  </p>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Share your UPI ID with the sender</li>
                    <li>• Ask them to scan the QR code</li>
                    <li>• Money will be credited instantly</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No UPI ID linked yet</p>
                <Button
                  onClick={() => setActiveTab("link")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Link Bank Account
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <Card>
            <h2 className="text-2xl font-bold mb-6 text-white">
              Transaction History
            </h2>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400">
                        UPI ID
                      </th>
                      <th className="text-right py-3 px-4 text-gray-400">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="py-3 px-4 text-white">
                          {new Date(txn.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-white">{txn.type}</td>
                        <td className="py-3 px-4 text-gray-300">{txn.upiId}</td>
                        <td
                          className={`py-3 px-4 text-right ${
                            txn.type === "SENT"
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {txn.type === "SENT" ? "-" : "+"}₹{txn.amount}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              txn.status === "SUCCESS"
                                ? "bg-green-900 text-green-400"
                                : "bg-red-900 text-red-400"
                            }`}
                          >
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No transactions yet</p>
                <Button
                  onClick={() => setActiveTab("upi")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Make Your First Transaction
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* KYC Modal */}
        {togglebox && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50">
            <Card className="w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Link your UPI and Metamask
              </h3>
              <div className="space-y-4">
                <Input label="UPI ID" name="upiId" value={upiId} readOnly />
                <Input
                  label="Metamask ID"
                  name="metamaskId"
                  value={metamaskId}
                  onChange={(e) => setMetamaskId(e.target.value)}
                  placeholder="Enter your Metamask ID"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={kycHandler}
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Link Accounts"}
                  </Button>
                  <Button
                    onClick={() => setTogglebox(false)}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bank;
