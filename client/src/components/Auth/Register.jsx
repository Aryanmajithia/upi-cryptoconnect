import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";
import Card from "../Card";
import Input from "../forms/Input";
import Button from "../Button";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", {
        name: `${firstName} ${lastName}`,
        email,
        password,
      });

      const { token, user } = response.data;
      Cookies.set("token", token, { expires: 7 });
      login(token, user);

      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <h2 className="text-3xl font-bold text-center text-white mb-2">
        Create an Account
      </h2>
      <p className="text-center text-gray-400 mb-8">
        Join us today! Enter your details to get started.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            label="First Name"
            name="first-name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="John"
            className="w-full"
          />
          <Input
            label="Last Name"
            name="last-name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Doe"
            className="w-full"
          />
        </div>
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

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-blue-400 hover:text-blue-500"
        >
          Sign In
        </Link>
      </p>
    </Card>
  );
};

export default Register;
