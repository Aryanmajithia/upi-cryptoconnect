import React from "react";

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
}) => (
  <div>
    <label
      htmlFor={name}
      className="block mb-2 text-sm font-medium text-gray-300"
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
      required={required}
      placeholder={placeholder}
    />
  </div>
);

export default Input;
