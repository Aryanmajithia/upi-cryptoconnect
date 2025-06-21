import React, { useState, useEffect } from "react";
import axios from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Card from "./Card";
import Button from "./Button";
import toast from "react-hot-toast";

const RecentActivity = () => {
  const { user } = useAuth();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const requestsPromise = axios.get("/money-transfer/all-request-money");
      const transactionsPromise = axios.get(`/transactions/user/${user.email}`);

      const [requestsRes, transactionsRes] = await Promise.all([
        requestsPromise,
        transactionsPromise,
      ]);

      const requests = requestsRes.data.money.requests.map((r) => ({
        ...r,
        type: "request",
      }));
      const transactions = transactionsRes.data.map((t) => ({
        ...t,
        type: "transaction",
      }));

      // Combine and sort by date
      const combined = [...requests, ...transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setActivity(combined);
    } catch (error) {
      console.error("Failed to fetch activity:", error);
      toast.error("Could not load recent activity.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [user]);

  const handlePayRequest = async (request) => {
    alert(
      `Paying request from ${request.name} for ${request.amount} ${request.token}`
    );
    // Here you would add the full payment logic (e.g., open a confirmation modal)
    // For now, we'll just refetch the activity list
    await fetchActivity();
  };

  const renderItem = (item) => {
    if (item.type === "request") {
      return (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-white">
              Incoming Request from {item.name}
            </p>
            <p className="text-sm text-gray-400">
              {item.message || "No message"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-yellow-400">
              {item.amount} {item.token}
            </p>
            <Button
              onClick={() => handlePayRequest(item)}
              size="sm"
              className="mt-1"
            >
              Pay Now
            </Button>
          </div>
        </div>
      );
    }

    if (item.type === "transaction") {
      return (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-white">Payment to {item.to}</p>
            <p className="text-sm text-gray-400">
              {item.keyword || "No message"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-green-400">
              -{item.amt} {item.coin}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(item.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-white mb-4">Activity</h3>
      {loading ? (
        <p className="text-gray-400">Loading activity...</p>
      ) : (
        <div className="space-y-4">
          {activity.length > 0 ? (
            activity.map((item, index) => (
              <div key={index} className="p-4 bg-gray-800 rounded-lg">
                {renderItem(item)}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">
              No recent activity found.
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default RecentActivity;
