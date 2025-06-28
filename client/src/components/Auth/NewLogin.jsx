import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/api";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useAuth } from "../../context/AuthContext";
import Card from "../Card";
import Input from "../forms/Input";
import Button from "../Button";
import { FaGoogle, FaGithub } from "react-icons/fa";

const SocialButton = ({ icon, children, onClick, disabled }) => (
  <button
    className={`w-full inline-flex items-center justify-center py-3 px-4 border border-gray-700 rounded-md text-sm font-medium text-white ${
      disabled
        ? "bg-gray-600 cursor-not-allowed"
        : "bg-gray-800 hover:bg-gray-700"
    } transition-colors`}
    onClick={onClick}
    disabled={disabled}
  >
    {icon}
    <span className="ml-2">{children}</span>
  </button>
);

const NewLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;
      if (formData.rememberMe) {
        Cookies.set("token", token, { expires: 30 }); // 30 days
      } else {
        Cookies.set("token", token, { expires: 1 }); // 1 day
      }

      await login(token, user);
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.error(`${provider} login is not implemented yet`);
  };

  return (
    <Card className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-white mb-2">
        Sign In
      </h2>
      <p className="text-center text-gray-400 mb-8">
        Welcome back! Please enter your details.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          placeholder="••••••••"
        />

        {errors.submit && (
          <div className="text-red-400 text-sm text-center">
            {errors.submit}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-600"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-gray-300">
              Remember me
            </label>
          </div>
          <Link
            to="/forgot-password"
            className="font-medium text-blue-400 hover:text-blue-500"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="mx-4 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>

      <div className="space-y-4">
        <SocialButton
          icon={<FaGoogle />}
          onClick={() => handleSocialLogin("Google")}
          disabled={loading}
        >
          Sign in with Google
        </SocialButton>
        <SocialButton
          icon={<FaGithub />}
          onClick={() => handleSocialLogin("GitHub")}
          disabled={loading}
        >
          Sign in with GitHub
        </SocialButton>
      </div>

      <p className="mt-8 text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-blue-400 hover:text-blue-500"
        >
          Sign Up
        </Link>
      </p>
    </Card>
  );
};

export default NewLogin;
