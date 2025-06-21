import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { FiDollarSign, FiActivity } from "react-icons/fi";
import StatCard from "../components/StatCard";
import TransactionChart from "../components/TransactionChart";
import RecentTransactions from "../components/RecentTransactions";
import Card from "../components/Card";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to process data for the chart
  const groupTransactionsByDate = (transactions) => {
    const grouped = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.timestamp).toISOString().split("T")[0]; // Group by day
      if (!acc[date]) {
        acc[date] = { debit: 0, credit: 0, date };
      }
      if (transaction.transactionType === "debit") {
        acc[date].debit += transaction.amount;
      } else {
        acc[date].credit += transaction.amount;
      }
      return acc;
    }, {});
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("/transactions");
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalCredit = transactions
    .filter((t) => t.transactionType === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.transactionType === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalCredit - totalDebit;

  const chartData = groupTransactionsByDate(transactions);

  if (loading) {
    // A proper loader would be better here
    return <div className="text-white p-8">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, here's a summary of your financial activity.
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={<FiDollarSign className="text-green-400" />}
                title="Total Credit"
                value={`$${totalCredit.toFixed(2)}`}
                change="+12%"
                isPositive
              />
              <StatCard
                icon={<FiDollarSign className="text-red-400" />}
                title="Total Debit"
                value={`$${totalDebit.toFixed(2)}`}
                change="-8%"
                isPositive={false}
              />
              <StatCard
                icon={<FiActivity className="text-blue-400" />}
                title="Net Balance"
                value={`$${netBalance.toFixed(2)}`}
              />
            </div>
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">
                Credit vs. Debit Trend
              </h3>
              <div className="h-80">
                <TransactionChart data={chartData} />
              </div>
            </Card>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1 space-y-6">
            <RecentTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
