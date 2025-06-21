import React from "react";

const Button = ({ children, className = "", ...props }) => (
  <button
    type="button"
    className={`py-3 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none hover:opacity-90 transition-opacity duration-300 ${className}`}
    {...props}
  >
    {children || "Get Started"}
  </button>
);

export default Button;
