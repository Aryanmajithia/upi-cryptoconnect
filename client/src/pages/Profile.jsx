import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiShield,
  FiSettings,
  FiEdit,
  FiSave,
  FiX,
} from "react-icons/fi";
import Card from "../components/Card";
import Button from "../components/Button";
import WalletManager from "../components/WalletManager";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zipCode: user?.zipCode || "",
    dateOfBirth: user?.dateOfBirth || "",
    walletAddress: user?.walletAddress || "",
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    emailNotifications: true,
    smsNotifications: false,
    transactionAlerts: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await api.put("/api/auth/update-profile", formData);

      if (response.data.success) {
        updateUser(response.data.user);
        setMessage("Profile updated successfully!");
        setMessageType("success");
        setIsEditing(false);
      } else {
        setMessage(response.data.message || "Failed to update profile");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(error.response?.data?.message || "Failed to update profile");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage("New passwords do not match");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await api.put("/api/auth/change-password", {
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });

      if (response.data.success) {
        setMessage("Password changed successfully!");
        setMessageType("success");
        setSecurityData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage(response.data.message || "Failed to change password");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage(error.response?.data?.message || "Failed to change password");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      zipCode: user?.zipCode || "",
      dateOfBirth: user?.dateOfBirth || "",
      walletAddress: user?.walletAddress || "",
    });
    setIsEditing(false);
    setMessage("");
  };

  const handleSecurityToggle = (setting) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <div className="min-h-screen bg-primary py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiUser className="inline mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("wallet")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "wallet"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiCreditCard className="inline mr-2" />
            Wallet
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "security"
                ? "bg-red-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiShield className="inline mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "settings"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FiSettings className="inline mr-2" />
            Settings
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    Personal Information
                  </h2>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                        >
                          {loading ? (
                            "Saving..."
                          ) : (
                            <>
                              <FiSave className="mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2"
                        >
                          <FiX className="mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                      >
                        <FiEdit className="mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>

                {message && (
                  <div
                    className={`mb-4 p-4 rounded-lg ${
                      messageType === "success"
                        ? "bg-green-900 text-green-100"
                        : "bg-red-900 text-red-100"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white disabled:opacity-50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white disabled:opacity-50"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <Card>
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Security Settings
                </h2>

                {message && (
                  <div
                    className={`mb-4 p-4 rounded-lg ${
                      messageType === "success"
                        ? "bg-green-900 text-green-100"
                        : "bg-red-900 text-red-100"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={securityData.currentPassword}
                      onChange={handleSecurityChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={securityData.newPassword}
                      onChange={handleSecurityChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={securityData.confirmPassword}
                      onChange={handleSecurityChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                  >
                    {loading ? "Changing Password..." : "Change Password"}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {activeTab === "wallet" && <WalletManager />}

            {/* User Stats */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">
                Account Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Account Status</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">KYC Status</span>
                  <span className="text-yellow-400">Pending</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Wallet Connected</span>
                  <span
                    className={
                      user?.walletAddress ? "text-green-400" : "text-red-400"
                    }
                  >
                    {user?.walletAddress ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
