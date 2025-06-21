import React from "react";
import Card from "../Card";

const LoanStatus = ({
  address,
  balance,
  status,
  timer,
  onWithdraw,
  onLockArena,
  loading,
}) => (
  <Card>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Contract Details
        </h3>
        <p className="text-sm text-gray-400">
          Status: <span className="font-medium text-white">{status}</span>
        </p>
        <p className="text-sm text-gray-400">
          Balance:{" "}
          <span className="font-medium text-white">{balance} USDC</span>
        </p>
        <p className="text-sm text-gray-400">
          Connected:{" "}
          <span className="font-medium text-green-400">
            {address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : "Not Connected"}
          </span>
        </p>
      </div>
      <div className="flex flex-col items-start md:items-end">
        <p className="text-lg font-semibold text-white mb-2">
          Next Opportunity: <span className="text-blue-400">{timer}s</span>
        </p>
        <div className="flex space-x-4 mt-2">
          <button
            onClick={onWithdraw}
            disabled={loading}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            {loading ? "Processing..." : "Withdraw"}
          </button>
          <button
            onClick={onLockArena}
            disabled={loading}
            className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
          >
            {loading ? "Processing..." : "Lock Arena"}
          </button>
        </div>
      </div>
    </div>
  </Card>
);

export default LoanStatus;
