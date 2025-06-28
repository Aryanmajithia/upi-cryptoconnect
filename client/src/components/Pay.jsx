import React, { useState } from "react";
import { useAddress, useContract, useTransferToken } from "@thirdweb-dev/react";
import axios from "../utils/api";
import toast from "react-hot-toast";
import Card from "./Card";
import Input from "./forms/Input";
import Button from "./Button";

const SendMoney = () => {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC"); // Default to USDC
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const walletAddress = useAddress();
  // Note: These are example contract addresses on the Polygon Mumbai testnet.
  // Replace them with your actual token contract addresses on your chosen network.
  const { contract: usdcToken } = useContract(
    "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8" // Example USDC address
  );
  const { mutateAsync: transferUSDC } = useTransferToken(usdcToken);
  const { contract: daiToken } = useContract(
    "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357" // Example DAI address
  );
  const { mutateAsync: transferDAI } = useTransferToken(daiToken);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!walletAddress) {
      toast.error("Please connect your wallet first.");
      return;
    }
    if (!upiId || !amount || parseFloat(amount) <= 0) {
      toast.error("Please fill in all fields correctly.");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Processing transaction...");

    try {
      // 1. Fetch receiver's wallet address from their UPI ID
      const res = await axios.post(`/api/auth/fetchdetail`, { upi: upiId });
      const receiverAddress = res.data?.metamaskId;

      if (!receiverAddress) {
        throw new Error("Could not find a wallet associated with that UPI ID.");
      }

      // 2. Perform the token transfer
      const transferAmount = parseFloat(amount);
      const transferPayload = {
        to: receiverAddress,
        amount: transferAmount,
      };

      if (token === "USDC") {
        await transferUSDC(transferPayload);
      } else if (token === "DAI") {
        await transferDAI(transferPayload);
      }

      // 3. Record the transaction in the backend
      await axios.post(`/api/pay/paymentWrite`, {
        date: new Date().toISOString(),
        to: upiId,
        amt: transferAmount,
        sender: walletAddress,
        keyword: message,
        coin: token,
      });

      toast.success("Payment sent successfully!", { id: toastId });
      setUpiId("");
      setAmount("");
      setMessage("");
    } catch (error) {
      console.error("Payment error:", error);
      let errorMessage = "An unexpected error occurred.";

      if (error.response?.status === 404) {
        errorMessage =
          "UPI ID not found. Please check the UPI ID and try again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6">Send Money</h2>
      <form onSubmit={handleSend} className="space-y-6">
        <Input
          label="Recipient's UPI ID"
          name="upiId"
          type="text"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          required
          placeholder="recipient@upi"
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            label="Amount"
            name="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="0.00"
            className="w-full"
          />
          <Input
            label="Token"
            name="token"
            type="select"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full"
            options={[
              { value: "USDC", label: "USDC" },
              { value: "DAI", label: "DAI" },
            ]}
          />
        </div>
        <Input
          label="Message (Optional)"
          name="message"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="For dinner, etc."
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send"}
        </Button>
      </form>
    </Card>
  );
};

export default SendMoney;
