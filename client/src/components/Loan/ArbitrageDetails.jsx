import React from "react";
import Card from "../Card";
import Button from "../Button";

const ArbitrageDetails = ({ pair, profit, onProceed, loading }) => (
  <Card>
    <h3 className="text-lg font-semibold text-white mb-4">
      Arbitrage Opportunity Found!
    </h3>
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
        <span className="text-gray-400">Token Pair:</span>
        <span className="font-mono text-white">{pair}</span>
      </div>
      <div className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
        <span className="text-gray-400">Estimated Profit:</span>
        <span className="font-mono text-green-400">{profit} USDC</span>
      </div>
      <Button onClick={onProceed} disabled={loading} className="w-full">
        {loading ? "Executing..." : "Proceed with Transaction"}
      </Button>
    </div>
  </Card>
);

export default ArbitrageDetails;
