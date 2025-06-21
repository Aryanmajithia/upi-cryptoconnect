import React, { useState } from "react";
import api from "../utils/api";
import { axis, hdfc, icici, pnb, sbi } from "../assets";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Input from "../components/forms/Input";
import Button from "../components/Button";

const banks = [
  {
    name: "State Bank of India",
    description:
      "State Bank of India is the largest public sector bank in India.",
    logo: sbi,
  },
  {
    name: "Punjab National Bank",
    description:
      "Punjab National Bank is a leading public sector bank in India.",
    logo: pnb,
  },
  {
    name: "HDFC Bank",
    description: "HDFC Bank is a major private sector bank in India.",
    logo: hdfc,
  },
  {
    name: "ICICI Bank",
    description: "ICICI Bank is a prominent private sector bank in India.",
    logo: icici,
  },
  {
    name: "Axis Bank",
    description: "Axis Bank is a well-known private sector bank in India.",
    logo: axis,
  },
];

const Bank = () => {
  const [selectedBank, setSelectedBank] = useState(null);
  const [togglebox, setTogglebox] = useState(false);
  const [upiId, setUPI] = useState("upi Id");
  const [metamaskId, setMetamaskId] = useState("meta");
  const [bid, setBid] = useState("");
  const [formData, setFormData] = useState({
    ifscCode: "",
    accountHolder: "",
    accountAddress: "",
    accountType: "",
    amount: 0,
  });
  // JFDS4435
  // 573950000342536
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBankSelection = (bank) => {
    setSelectedBank(bank);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      // alert('Bank details added successfully');
    } catch (error) {
      console.log(error);
      alert("Error adding bank details");
    }
  };

  const kycHandler = async () => {
    try {
      const links = await api.post(`/bank/linking`, {
        upi: upiId,
        metamask: metamaskId,
        bid: bid,
      });
      console.log(links);
      setTogglebox(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className="min-h-screen text-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-4xl">
          <div className="flex flex-col md:flex-row">
            {/* Left Side: Bank Selection */}
            <div className="w-full md:w-1/2 p-6 border-r border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-white">
                Select Your Bank
              </h2>
              <div className="space-y-4">
                {banks.map((bank) => (
                  <button
                    key={bank.name}
                    onClick={() => handleBankSelection(bank)}
                    className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center
                      ${
                        selectedBank?.name === bank.name
                          ? "bg-blue-gradient"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                  >
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      className="h-8 w-8 mr-4 rounded-full"
                    />
                    <span>{bank.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full md:w-1/2 p-6">
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
                    <Button type="submit" className="w-full">
                      Next
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-center text-gray-500">
                    Please select a bank to continue.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* KYC Modal */}
        {togglebox && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
            <Card className="w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
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
              </div>
              <Button onClick={kycHandler} className="w-full mt-6">
                Complete KYC
              </Button>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Bank;
