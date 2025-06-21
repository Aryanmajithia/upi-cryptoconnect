import React from "react";
import Card from "../Card";

const LoanHistory = ({ history, loading, error }) => (
  <Card>
    <h3 className="text-lg font-semibold text-white mb-4">Loan History</h3>
    {loading && <p className="text-gray-400">Loading history...</p>}
    {error && <p className="text-red-400">{error}</p>}
    {!loading && !error && (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Pair
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Profit
              </th>
              <th scope="col" className="px-6 py-3">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr
                key={index}
                className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-white">
                  {item.pair}
                </td>
                <td className="px-6 py-4">{item.amount}</td>
                <td className="px-6 py-4 text-green-400">{item.profit}</td>
                <td className="px-6 py-4">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Card>
);

export default LoanHistory;
