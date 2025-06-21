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

const SocialButton = ({ icon, children, ...props }) => (
  <button
    className="w-full inline-flex items-center justify-center py-3 px-4 border border-gray-700 rounded-md text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors"
    {...props}
  >
    {icon}
    <span className="ml-2">{children}</span>
  </button>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password }
      );

      const token = response.data.token;
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("userEmail", email, { expires: 1 });
      login(token, { email });

      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />

        {error && (
          <div className="text-red-400 text-sm text-center -py-2">{error}</div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-600"
            />
            <label htmlFor="remember-me" className="ml-2 block text-gray-300">
              Remember me
            </label>
          </div>
          <a href="#" className="font-medium text-blue-400 hover:text-blue-500">
            Forgot password?
          </a>
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
        <SocialButton icon={<FaGoogle />}>Sign in with Google</SocialButton>
        <SocialButton icon={<FaGithub />}>Sign in with GitHub</SocialButton>
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

export default Login;
