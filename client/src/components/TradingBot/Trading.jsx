import React, { useEffect, useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import { FaChartLine, FaTable } from "react-icons/fa";
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Chart from "chart.js/auto";

const RealTimeStockData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStock, setSelectedStock] = useState("IBM");
  const [interval, setInterval] = useState("5min");
  const [chartData, setChartData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  const stocks = [
    { symbol: "IBM", name: "International Business Machines" },
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corporation" },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "AMZN", name: "Amazon.com Inc." },
  ];

  const intervals = [
    { value: "1min", label: "1 Minute" },
    { value: "5min", label: "5 Minutes" },
    { value: "15min", label: "15 Minutes" },
    { value: "30min", label: "30 Minutes" },
    { value: "60min", label: "1 Hour" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${selectedStock}&interval=${interval}&apikey=demo`
        );

        if (result.data["Error Message"]) {
          throw new Error(result.data["Error Message"]);
        }

        const timeSeries = result.data[`Time Series (${interval})`];
        if (!timeSeries) {
          throw new Error("No time series data available");
        }

        const chartData = Object.keys(timeSeries).map((time) => ({
          time,
          open: parseFloat(timeSeries[time]["1. open"]),
          high: parseFloat(timeSeries[time]["2. high"]),
          low: parseFloat(timeSeries[time]["3. low"]),
          close: parseFloat(timeSeries[time]["4. close"]),
          volume: parseFloat(timeSeries[time]["5. volume"]),
        }));

        setData(chartData.reverse());
        updateCharts(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 60000); // Fetch new data every minute

    return () => clearInterval(intervalId);
  }, [selectedStock, interval]);

  const updateCharts = (chartData) => {
    if (!chartData.length) return;

    // Destroy existing charts if they exist to avoid duplicate charts
    if (Chart.getChart("priceChart")) Chart.getChart("priceChart").destroy();
    if (Chart.getChart("volumeChart")) Chart.getChart("volumeChart").destroy();
    if (Chart.getChart("highLowChart"))
      Chart.getChart("highLowChart").destroy();
    if (Chart.getChart("openCloseChart"))
      Chart.getChart("openCloseChart").destroy();

    // Price over Time
    new Chart(document.getElementById("priceChart"), {
      type: "line",
      data: {
        labels: chartData.map((entry) => entry.time),
        datasets: [
          {
            label: "Close Price",
            data: chartData.map((entry) => entry.close),
            borderColor: "#28a745",
            backgroundColor: "rgba(40, 167, 69, 0.1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#fff",
            },
          },
          tooltip: {
            backgroundColor: "#1f2937",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#28a745",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#fff",
            },
            grid: {
              color: "#555",
            },
          },
          y: {
            ticks: {
              color: "#fff",
            },
            grid: {
              color: "#555",
            },
          },
        },
      },
    });

    // Volume over Time
    new Chart(document.getElementById("volumeChart"), {
      type: "bar",
      data: {
        labels: chartData.map((entry) => entry.time),
        datasets: [
          {
            label: "Volume",
            data: chartData.map((entry) => entry.volume),
            borderColor: "#dc3545",
            backgroundColor: "#dc3545",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#fff",
            },
          },
          tooltip: {
            backgroundColor: "#dc3545",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#dc3545",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#fff",
            },
            grid: {
              color: "#555",
            },
          },
          y: {
            ticks: {
              color: "#fff",
            },
            grid: {
              color: "#555",
            },
          },
        },
      },
    });

    // High and Low Prices
    new Chart(document.getElementById("highLowChart"), {
      type: "line",
      data: {
        labels: chartData.map((entry) => entry.time),
        datasets: [
          {
            label: "High Price",
            data: chartData.map((entry) => entry.high),
            borderColor: "#28a745",
            backgroundColor: "rgba(40, 167, 69, 0.1)",
          },
          {
            label: "Low Price",
            data: chartData.map((entry) => entry.low),
            borderColor: "#dc3545",
            backgroundColor: "rgba(220, 53, 69, 0.1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#fff",
            },
          },
          tooltip: {
            backgroundColor: "#1f2937",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#dc3545",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#fff",
            },
            grid: {
              color: "#555",
            },
          },
          y: {
            ticks: {
              color: "#fff",
            },
            grid: {
              color: "#555",
            },
          },
        },
      },
    });

    // Open and Close Prices
    new Chart(document.getElementById("openCloseChart"), {
      type: "line",
      data: {
        labels: chartData.map((entry) => entry.time),
        datasets: [
          {
            label: "Open Price",
            data: chartData.map((entry) => entry.open),
            borderColor: "#ffc107",
            backgroundColor: "rgba(255, 193, 7, 0.1)",
          },
          {
            label: "Close Price",
            data: chartData.map((entry) => entry.close),
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#fff",
            },
          },
          tooltip: {
            backgroundColor: "#1f2937",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#007bff",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#fff",
            },
            grid: {
              color: "#555",
            },
          },
          y: {
            ticks: {
              color: "#fff",
            },
            grid: {
              color: "#555",
            },
          },
        },
      },
    });
  };

  const handleTrade = (entry) => {
    setSelectedTrade(entry);
    setShowConfirmation(true);
  };

  const confirmTrade = async () => {
    try {
      setLoading(true);
      setError("");
      setShowConfirmation(false);
      // Add your trade execution logic here
      setError("Trade executed successfully!");
    } catch (error) {
      console.error("Trade error:", error);
      setError("Trade failed. Please try again.");
    } finally {
      setLoading(false);
      setSelectedTrade(null);
    }
  };

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <div className="bg-black text-white w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">
            Real-Time Stock Data <FaChartLine className="inline-block ml-2" />
          </h1>
          <div className="flex gap-4">
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="bg-zinc-800 text-white p-2 rounded"
            >
              {stocks.map((stock) => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.name} ({stock.symbol})
                </option>
              ))}
            </select>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="bg-zinc-800 text-white p-2 rounded"
            >
              {intervals.map((int) => (
                <option key={int.value} value={int.value}>
                  {int.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4 flex items-center">
            <FiAlertCircle className="mr-2" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Loading stock data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-2">Price Over Time</h2>
                <div className="h-64">
                  <canvas id="priceChart"></canvas>
                </div>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-2">Volume Over Time</h2>
                <div className="h-64">
                  <canvas id="volumeChart"></canvas>
                </div>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-2">High and Low Prices</h2>
                <div className="h-64">
                  <canvas id="highLowChart"></canvas>
                </div>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-2">
                  Open and Close Prices
                </h2>
                <div className="h-64">
                  <canvas id="openCloseChart"></canvas>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 p-4 rounded-lg mt-4">
              <h2 className="text-2xl font-bold mb-4">
                Detailed Stock Data <FaTable className="inline-block ml-2" />
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-700">
                        Time
                      </th>
                      <th className="py-2 px-4 border-b border-gray-700">
                        Open
                      </th>
                      <th className="py-2 px-4 border-b border-gray-700">
                        High
                      </th>
                      <th className="py-2 px-4 border-b border-gray-700">
                        Low
                      </th>
                      <th className="py-2 px-4 border-b border-gray-700">
                        Close
                      </th>
                      <th className="py-2 px-4 border-b border-gray-700">
                        Volume
                      </th>
                      <th className="py-2 px-4 border-b border-gray-700">
                        Change
                      </th>
                      <th className="py-2 px-4 border-b border-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((entry, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="py-2 px-4">{entry.time}</td>
                        <td className="py-2 px-4">{entry.open.toFixed(2)}</td>
                        <td className="py-2 px-4 text-green-500">
                          {entry.high.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 text-red-500">
                          {entry.low.toFixed(2)}
                        </td>
                        <td className="py-2 px-4">{entry.close.toFixed(2)}</td>
                        <td className="py-2 px-4">
                          {entry.volume.toLocaleString()}
                        </td>
                        <td
                          className={`py-2 px-4 ${
                            entry.close >= entry.open
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {(entry.close - entry.open).toFixed(2)}
                        </td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => handleTrade(entry)}
                            className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Trade
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {showConfirmation && selectedTrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-boxbg p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Trade</h3>
            <div className="mb-4">
              <p className="mb-2">Time: {selectedTrade.time}</p>
              <p className="mb-2">Price: {selectedTrade.close.toFixed(2)}</p>
              <p className="mb-2">
                Volume: {selectedTrade.volume.toLocaleString()}
              </p>
              <p className="mb-2">
                Change: {(selectedTrade.close - selectedTrade.open).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedTrade(null);
                }}
                className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmTrade}
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm Trade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeStockData;
