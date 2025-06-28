import React from "react";

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  error,
  className = "",
  options = [],
  readOnly = false,
  ...props
}) => (
  <div className={className}>
    <label
      htmlFor={name}
      className="block mb-2 text-sm font-medium text-gray-300"
    >
      {label}
    </label>
    {type === "select" ? (
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        required={required}
        readOnly={readOnly}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        required={required}
        placeholder={placeholder}
        readOnly={readOnly}
        {...props}
      />
    )}
    {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
  </div>
);

export default Input;
