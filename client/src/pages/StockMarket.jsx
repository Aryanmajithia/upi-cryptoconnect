import React, { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiBarChart,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import Card from "../components/Card";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const StockMarket = () => {
  const { user } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("market");

  // Mock stock data - in real app, this would come from an API
  const mockStocks = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 150.25,
      change: 2.15,
      changePercent: 1.45,
      volume: "45.2M",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 2750.8,
      change: -15.2,
      changePercent: -0.55,
      volume: "12.8M",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: 310.45,
      change: 8.75,
      changePercent: 2.89,
      volume: "28.9M",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      price: 3200.0,
      change: 45.5,
      changePercent: 1.44,
      volume: "15.6M",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 850.3,
      change: -25.7,
      changePercent: -2.94,
      volume: "32.1M",
    },
    {
      symbol: "NFLX",
      name: "Netflix Inc.",
      price: 450.75,
      change: 12.25,
      changePercent: 2.79,
      volume: "8.9M",
    },
    {
      symbol: "META",
      name: "Meta Platforms Inc.",
      price: 280.9,
      change: 5.6,
      changePercent: 2.03,
      volume: "22.3M",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      price: 420.15,
      change: 18.45,
      changePercent: 4.59,
      volume: "35.7M",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStocks(mockStocks);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBuyStock = (stock) => {
    const newPortfolio = [...portfolio];
    const existingStock = newPortfolio.find(
      (item) => item.symbol === stock.symbol
    );

    if (existingStock) {
      existingStock.quantity += 1;
      existingStock.totalValue = existingStock.quantity * stock.price;
    } else {
      newPortfolio.push({
        ...stock,
        quantity: 1,
        totalValue: stock.price,
        purchasePrice: stock.price,
      });
    }

    setPortfolio(newPortfolio);
  };

  const handleSellStock = (stock) => {
    const newPortfolio = [...portfolio];
    const existingStock = newPortfolio.find(
      (item) => item.symbol === stock.symbol
    );

    if (existingStock && existingStock.quantity > 0) {
      existingStock.quantity -= 1;
      existingStock.totalValue = existingStock.quantity * stock.price;

      if (existingStock.quantity === 0) {
        const index = newPortfolio.findIndex(
          (item) => item.symbol === stock.symbol
        );
        newPortfolio.splice(index, 1);
      }
    }

    setPortfolio(newPortfolio);
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, stock) => total + stock.totalValue, 0);
  };

  const calculateTotalGainLoss = () => {
    return portfolio.reduce((total, stock) => {
      const gainLoss = (stock.price - stock.purchasePrice) * stock.quantity;
      return total + gainLoss;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading stock market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Stock Market</h1>
          <p className="text-gray-400">
            Real-time stock data and portfolio management
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab("market")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "market"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiBarChart className="inline mr-2" />
            Market
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "portfolio"
                ? "bg-green-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiDollarSign className="inline mr-2" />
            Portfolio
          </button>
        </div>

        {/* Market Tab */}
        {activeTab === "market" && (
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                />
              </div>
            </Card>

            {/* Stock List */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-4">
                Market Overview
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400">
                        Symbol
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400">
                        Company
                      </th>
                      <th className="text-right py-3 px-4 text-gray-400">
                        Price
                      </th>
                      <th className="text-right py-3 px-4 text-gray-400">
                        Change
                      </th>
                      <th className="text-right py-3 px-4 text-gray-400">
                        Volume
                      </th>
                      <th className="text-center py-3 px-4 text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStocks.map((stock) => (
                      <tr
                        key={stock.symbol}
                        className="border-b border-gray-800 hover:bg-gray-800"
                      >
                        <td className="py-3 px-4 text-white font-semibold">
                          {stock.symbol}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {stock.name}
                        </td>
                        <td className="py-3 px-4 text-right text-white">
                          ${stock.price.toFixed(2)}
                        </td>
                        <td
                          className={`py-3 px-4 text-right ${
                            stock.change >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change.toFixed(2)} (
                          {stock.changePercent.toFixed(2)}%)
                        </td>
                        <td className="py-3 px-4 text-right text-gray-400">
                          {stock.volume}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button
                              onClick={() => handleBuyStock(stock)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
                            >
                              <FiPlus className="mr-1" />
                              Buy
                            </Button>
                            <Button
                              onClick={() => handleSellStock(stock)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                            >
                              <FiMinus className="mr-1" />
                              Sell
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="text-center">
                  <h3 className="text-gray-400 text-sm mb-2">Total Value</h3>
                  <p className="text-2xl font-bold text-white">
                    ${calculatePortfolioValue().toFixed(2)}
                  </p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <h3 className="text-gray-400 text-sm mb-2">
                    Total Gain/Loss
                  </h3>
                  <p
                    className={`text-2xl font-bold ${
                      calculateTotalGainLoss() >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {calculateTotalGainLoss() >= 0 ? "+" : ""}$
                    {calculateTotalGainLoss().toFixed(2)}
                  </p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <h3 className="text-gray-400 text-sm mb-2">Holdings</h3>
                  <p className="text-2xl font-bold text-white">
                    {portfolio.length}
                  </p>
                </div>
              </Card>
            </div>

            {/* Portfolio Holdings */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-4">
                Your Holdings
              </h2>
              {portfolio.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">
                    No stocks in your portfolio yet
                  </p>
                  <Button
                    onClick={() => setActiveTab("market")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Start Trading
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400">
                          Stock
                        </th>
                        <th className="text-right py-3 px-4 text-gray-400">
                          Quantity
                        </th>
                        <th className="text-right py-3 px-4 text-gray-400">
                          Avg Price
                        </th>
                        <th className="text-right py-3 px-4 text-gray-400">
                          Current Price
                        </th>
                        <th className="text-right py-3 px-4 text-gray-400">
                          Total Value
                        </th>
                        <th className="text-right py-3 px-4 text-gray-400">
                          Gain/Loss
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.map((stock) => {
                        const gainLoss =
                          (stock.price - stock.purchasePrice) * stock.quantity;
                        const gainLossPercent =
                          ((stock.price - stock.purchasePrice) /
                            stock.purchasePrice) *
                          100;

                        return (
                          <tr
                            key={stock.symbol}
                            className="border-b border-gray-800"
                          >
                            <td className="py-3 px-4">
                              <div>
                                <p className="text-white font-semibold">
                                  {stock.symbol}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  {stock.name}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right text-white">
                              {stock.quantity}
                            </td>
                            <td className="py-3 px-4 text-right text-gray-300">
                              ${stock.purchasePrice.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right text-white">
                              ${stock.price.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right text-white">
                              ${stock.totalValue.toFixed(2)}
                            </td>
                            <td
                              className={`py-3 px-4 text-right ${
                                gainLoss >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {gainLoss >= 0 ? "+" : ""}${gainLoss.toFixed(2)} (
                              {gainLossPercent.toFixed(2)}%)
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockMarket;
