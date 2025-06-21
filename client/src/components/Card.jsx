import React from "react";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg border border-gray-700 rounded-2xl shadow-lg p-6 ${className}`}
  >
    {children}
  </div>
);

export default Card;
