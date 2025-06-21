import React from "react";
import Card from "./Card";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const StatCard = ({ icon, title, value, change, isPositive }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gray-700 rounded-full">{icon}</div>
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-white">{value}</p>
        </div>
      </div>
      {change && (
        <div
          className={`flex items-center text-sm font-medium ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
          <span className="ml-1">{change}</span>
        </div>
      )}
    </div>
  </Card>
);

export default StatCard;
