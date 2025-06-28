import React, { useState, useEffect } from "react";
import axios from "axios";
import CryptoTransaction from "../components/CryptoTransaction";
import WalletManager from "../components/WalletManager";
import Card from "../components/Card";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiBarChart,
  FiRefreshCw,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const CryptoTracker = () => {
  const { user } = useAuth();
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [loading, setLoading] = useState(true);
  const [conversionValue, setConversionValue] = useState("");
  const [conversionResult, setConversionResult] = useState("");
  const [activeTab, setActiveTab] = useState("market");
  const [portfolio, setPortfolio] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 20,
              page: 1,
            },
          }
        );

        setCryptoData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching crypto list:", error);
        setError("Failed to load cryptocurrency data. Please try again.");
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, []);

  const handleCryptoChange = (e) => {
    setSelectedCrypto(e.target.value);
  };

  const handleConversion = () => {
    const selectedCoin = cryptoData.find((coin) => coin.id === selectedCrypto);
    if (selectedCoin && conversionValue) {
      setConversionResult(
        (conversionValue / selectedCoin.current_price).toFixed(8)
      );
    }
  };

  const handleBuyCrypto = (crypto) => {
    const newPortfolio = [...portfolio];
    const existingCrypto = newPortfolio.find((item) => item.id === crypto.id);

    if (existingCrypto) {
      existingCrypto.quantity += 1;
      existingCrypto.totalValue =
        existingCrypto.quantity * crypto.current_price;
    } else {
      newPortfolio.push({
        ...crypto,
        quantity: 1,
        totalValue: crypto.current_price,
        purchasePrice: crypto.current_price,
      });
    }

    setPortfolio(newPortfolio);
  };

  const handleSellCrypto = (crypto) => {
    const newPortfolio = [...portfolio];
    const existingCrypto = newPortfolio.find((item) => item.id === crypto.id);

    if (existingCrypto && existingCrypto.quantity > 0) {
      existingCrypto.quantity -= 1;
      existingCrypto.totalValue =
        existingCrypto.quantity * crypto.current_price;

      if (existingCrypto.quantity === 0) {
        const index = newPortfolio.findIndex((item) => item.id === crypto.id);
        newPortfolio.splice(index, 1);
      }
    }

    setPortfolio(newPortfolio);
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, crypto) => total + crypto.totalValue, 0);
  };

  const calculateTotalGainLoss = () => {
    return portfolio.reduce((total, crypto) => {
      const gainLoss =
        (crypto.current_price - crypto.purchasePrice) * crypto.quantity;
      return total + gainLoss;
    }, 0);
  };

  const selectedCryptoData = cryptoData.find(
    (crypto) => crypto.id === selectedCrypto
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading crypto data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️</div>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Crypto Tracker</h1>
          <p className="text-gray-400">
            Real-time cryptocurrency prices and portfolio management
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
          <button
            onClick={() => setActiveTab("wallet")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "wallet"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiTrendingUp className="inline mr-2" />
            Wallet
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Market Tab */}
            {activeTab === "market" && (
              <>
                {/* Conversion Section */}
                <Card>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Price Converter
                  </h2>
                  {selectedCryptoData && (
                    <div className="mb-4">
                      <p className="text-gray-300">
                        {selectedCryptoData.name} (
                        {selectedCryptoData.symbol.toUpperCase()}) is currently
                        priced at ${selectedCryptoData.current_price.toFixed(2)}{" "}
                        USD.
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="number"
                        value={conversionValue}
                        onChange={(e) => setConversionValue(e.target.value)}
                        placeholder="Amount in USD"
                        className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white"
                      />
                    </div>
                    <button
                      onClick={handleConversion}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded transition-colors"
                    >
                      Convert to {selectedCrypto.toUpperCase()}
                    </button>
                  </div>
                  {conversionResult && (
                    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                      <p className="text-lg font-semibold text-white">
                        {conversionValue} USD = {conversionResult}{" "}
                        {selectedCrypto.toUpperCase()}
                      </p>
                    </div>
                  )}
                </Card>

                {/* Crypto Table */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-white">
                      Top Cryptocurrencies
                    </h2>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-gray-400 hover:text-white"
                    >
                      <FiRefreshCw className="text-lg" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="py-2 px-4 text-left text-gray-400">
                            #
                          </th>
                          <th className="py-2 px-4 text-left text-gray-400">
                            Coin
                          </th>
                          <th className="py-2 px-4 text-left text-gray-400">
                            Price
                          </th>
                          <th className="py-2 px-4 text-left text-gray-400">
                            24h Change
                          </th>
                          <th className="py-2 px-4 text-left text-gray-400">
                            Market Cap
                          </th>
                          <th className="py-2 px-4 text-center text-gray-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cryptoData.map((crypto, index) => (
                          <tr
                            key={crypto.id}
                            className="border-b border-gray-800 hover:bg-gray-800"
                          >
                            <td className="py-2 px-4 text-gray-400">
                              {index + 1}
                            </td>
                            <td className="py-2 px-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={crypto.image}
                                  alt={crypto.name}
                                  className="h-8 w-8"
                                />
                                <div>
                                  <p className="text-white font-semibold">
                                    {crypto.name}
                                  </p>
                                  <p className="text-gray-400 text-sm">
                                    {crypto.symbol.toUpperCase()}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 px-4 text-white">
                              ${crypto.current_price.toFixed(2)}
                            </td>
                            <td
                              className={`py-2 px-4 ${
                                crypto.price_change_percentage_24h > 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {crypto.price_change_percentage_24h > 0
                                ? "+"
                                : ""}
                              {crypto.price_change_percentage_24h.toFixed(2)}%
                            </td>
                            <td className="py-2 px-4 text-gray-300">
                              ${crypto.market_cap.toLocaleString()}
                            </td>
                            <td className="py-2 px-4 text-center">
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => handleBuyCrypto(crypto)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  <FiPlus className="inline mr-1" />
                                  Buy
                                </button>
                                <button
                                  onClick={() => handleSellCrypto(crypto)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  <FiMinus className="inline mr-1" />
                                  Sell
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )}

            {/* Portfolio Tab */}
            {activeTab === "portfolio" && (
              <div className="space-y-6">
                {/* Portfolio Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <div className="text-center">
                      <h3 className="text-gray-400 text-sm mb-2">
                        Total Value
                      </h3>
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
                        No cryptocurrencies in your portfolio yet
                      </p>
                      <button
                        onClick={() => setActiveTab("market")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                      >
                        Start Trading
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-400">
                              Coin
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
                          {portfolio.map((crypto) => {
                            const gainLoss =
                              (crypto.current_price - crypto.purchasePrice) *
                              crypto.quantity;
                            const gainLossPercent =
                              ((crypto.current_price - crypto.purchasePrice) /
                                crypto.purchasePrice) *
                              100;

                            return (
                              <tr
                                key={crypto.id}
                                className="border-b border-gray-800"
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={crypto.image}
                                      alt={crypto.name}
                                      className="h-8 w-8"
                                    />
                                    <div>
                                      <p className="text-white font-semibold">
                                        {crypto.name}
                                      </p>
                                      <p className="text-gray-400 text-sm">
                                        {crypto.symbol.toUpperCase()}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right text-white">
                                  {crypto.quantity}
                                </td>
                                <td className="py-3 px-4 text-right text-gray-300">
                                  ${crypto.purchasePrice.toFixed(2)}
                                </td>
                                <td className="py-3 px-4 text-right text-white">
                                  ${crypto.current_price.toFixed(2)}
                                </td>
                                <td className="py-3 px-4 text-right text-white">
                                  ${crypto.totalValue.toFixed(2)}
                                </td>
                                <td
                                  className={`py-3 px-4 text-right ${
                                    gainLoss >= 0
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {gainLoss >= 0 ? "+" : ""}$
                                  {gainLoss.toFixed(2)} (
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

            {/* Wallet Tab */}
            {activeTab === "wallet" && <CryptoTransaction />}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <WalletManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoTracker;
