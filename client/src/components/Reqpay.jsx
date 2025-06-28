import React, { useState } from "react";
import axios from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Card from "./Card";
import Input from "./forms/Input";
import Button from "./Button";

const RequestMoney = ({ onNewRequest }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!user || !user.email) {
      toast.error("You must be logged in to request money.");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Sending request...");

    try {
      const payload = {
        name: user.name || user.email, // Use name if available
        email: user.email,
        amount: parseFloat(amount),
        token,
        message,
      };

      await axios.post(`/api/money-transfer/request-money`, payload);

      toast.success("Money request sent successfully!", { id: toastId });

      if (onNewRequest) {
        onNewRequest(); // Callback to refresh the list of requests
      }

      setAmount("");
      setMessage("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6">Request Money</h2>
      <form onSubmit={handleRequest} className="space-y-6">
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
          placeholder="For pizza, etc."
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Requesting..." : "Request"}
        </Button>
      </form>
    </Card>
  );
};

export default RequestMoney;
