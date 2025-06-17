import React, { useState } from "react";

const TransactionFilter = ({ onFilterChange }) => {
  const [filter, setFilter] = useState({
    type: "all",
    dateRange: "all",
    amountRange: "all",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilter = { ...filter, [name]: value };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-3">Filter Transactions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            name="type"
            value={filter.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date Range
          </label>
          <select
            name="dateRange"
            value={filter.dateRange}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount Range
          </label>
          <select
            name="amountRange"
            value={filter.amountRange}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Amounts</option>
            <option value="small">Small (0-1000)</option>
            <option value="medium">Medium (1000-5000)</option>
            <option value="large">Large (5000+)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilter;
