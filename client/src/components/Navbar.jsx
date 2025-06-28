import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAddress } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import Button from "./Button";
import { FiMenu, FiX, FiCreditCard, FiUser, FiLogOut } from "react-icons/fi";
import { logo } from "../assets";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const address = useAddress();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard", protected: true },
    { label: "Bank & UPI", path: "/bank", protected: true },
    { label: "Crypto", path: "/crypto-tracker", protected: true },
    { label: "Stocks", path: "/stock-market", protected: true },
    { label: "Flash Loans", path: "/flash-loans", protected: true },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="w-full bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="CryptoConnect"
              className="w-8 h-8 object-contain"
            />
            <span className="text-white font-bold text-lg hidden sm:block">
              CryptoConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems
              .filter((item) => !item.protected || isAuthenticated)
              .map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActiveRoute(item.path)
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Wallet Connection */}
                {address ? (
                  <div className="flex items-center space-x-2 bg-green-900/30 border border-green-500/30 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm font-mono">
                      {formatAddress(address)}
                    </span>
                  </div>
                ) : (
                  <ConnectWallet
                    theme="dark"
                    btnTitle="Connect Wallet"
                    modalTitle="Connect to CryptoConnect"
                    className="!bg-blue-600 hover:!bg-blue-700 !text-white !px-4 !py-2 !rounded-lg !text-sm"
                  />
                )}

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
                    <FiUser className="text-gray-300" />
                    <span className="text-white text-sm">
                      {user?.firstName || "Profile"}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-700">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <FiUser className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button styles="bg-transparent border border-gray-600 hover:bg-gray-800 text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button styles="bg-blue-600 hover:bg-blue-700 text-white">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setToggle(!toggle)}
              className="text-gray-300 hover:text-white p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              {toggle ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {toggle && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Links */}
              {menuItems
                .filter((item) => !item.protected || isAuthenticated)
                .map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActiveRoute(item.path)
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                    onClick={() => setToggle(false)}
                  >
                    {item.label}
                  </Link>
                ))}

              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="pt-4 space-y-3 border-t border-gray-800">
                  {/* Wallet Connection */}
                  {address ? (
                    <div className="flex items-center space-x-2 bg-green-900/30 border border-green-500/30 px-3 py-2 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm font-mono">
                        {formatAddress(address)}
                      </span>
                    </div>
                  ) : (
                    <div className="px-3">
                      <ConnectWallet
                        theme="dark"
                        btnTitle="Connect Wallet"
                        modalTitle="Connect to CryptoConnect"
                        className="w-full !bg-blue-600 hover:!bg-blue-700 !text-white !px-4 !py-2 !rounded-lg !text-sm"
                      />
                    </div>
                  )}

                  {/* Profile and Logout */}
                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                      onClick={() => setToggle(false)}
                    >
                      <FiUser className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setToggle(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-md transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 space-y-2 border-t border-gray-800">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                    onClick={() => setToggle(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    onClick={() => setToggle(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
