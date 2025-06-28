import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get("token") || localStorage.getItem("token");
      if (token) {
        try {
          await verifyToken(token);
        } catch (error) {
          console.error("Auth initialization failed:", error);
          // Silently logout without showing toast during initialization
          silentLogout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.valid) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        // Refresh token if needed
        if (response.data.newToken) {
          updateToken(response.data.newToken);
        }
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      throw error;
    }
  };

  const updateToken = (token) => {
    Cookies.set("token", token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
    localStorage.setItem("token", token);
  };

  const login = async (token, userData) => {
    try {
      updateToken(token);
      setIsAuthenticated(true);
      setUser(userData);
      toast.success("Successfully logged in!");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
      throw error;
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const silentLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userEmail");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const logout = () => {
    silentLogout();
    toast.success("Successfully logged out!");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        login,
        logout,
        updateUser,
        verifyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
