import React, { Suspense, useEffect, useState } from "react";
import styles from "./style";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import { Navbar } from "./components";
import Dashboard from "./pages/Dashboard.jsx";
import TransactionForm from "./pages/AddTransaction.jsx";
import CryptoTracker from "./pages/Crypto.jsx";
import Loan from "./pages/Loans.jsx";
import Cookies from "js-cookie";
import ProtectedRoute from "./PrivateRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import Loader from "./components/Loader.jsx";
import Bank from "./pages/Bank.jsx";
import MainTransaction from "./pages/MainTransaction.jsx";
import Payements from "./pages/Payements.jsx";
import { AuthProvider } from "./context/AuthContext";
import RealTimeStockData from "./components/TradingBot/Trading.jsx";

const App = () => {
  const [tt, setToken] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    setToken(token);
  });

  return (
    <AuthProvider>
      <div className="bg-primary w-full overflow-hidden">
        <Router>
          <div className={`${styles.paddingX} ${styles.flexCenter}`}>
            <div className={`${styles.boxWidth}`}>
              <Navbar />
            </div>
          </div>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/flash loans" element={<Loan />} />
              <Route path="/crypto tracker" element={<CryptoTracker />} />
              <Route path="/stock market" element={<RealTimeStockData />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute isAuthenticated={!!tt} />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transaction" element={<TransactionForm />} />
                <Route path="/cryptupi" element={<Payements />} />
                <Route path="/KYC" element={<Bank />} />
                <Route path="/bank detail" element={<MainTransaction />} />
              </Route>

              {/* Catch-all route */}
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;
