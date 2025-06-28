import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NewLoginPage from "./components/Auth/NewLoginPage";
import NewRegisterPage from "./components/Auth/NewRegisterPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import FlashLoans from "./pages/FlashLoans";
import SendAndRequest from "./pages/SendAndRequest";
import Payements from "./pages/Payements";
import Loans from "./pages/Loans";
import Bank from "./pages/Bank";
import Crypto from "./pages/Crypto";
import StockMarket from "./pages/StockMarket";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" />
        <div className="min-h-screen bg-primary flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<NewLoginPage />} />
              <Route path="/register" element={<NewRegisterPage />} />
              <Route
                path="/flash-loans"
                element={
                  <PrivateRoute>
                    <FlashLoans />
                  </PrivateRoute>
                }
              />
              <Route
                path="/crypto-tracker"
                element={
                  <PrivateRoute>
                    <Crypto />
                  </PrivateRoute>
                }
              />
              <Route
                path="/stock-market"
                element={
                  <PrivateRoute>
                    <StockMarket />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <PrivateRoute>
                    <Payements />
                  </PrivateRoute>
                }
              />
              <Route
                path="/send-and-request"
                element={
                  <PrivateRoute>
                    <SendAndRequest />
                  </PrivateRoute>
                }
              />
              <Route
                path="/loans"
                element={
                  <PrivateRoute>
                    <Loans />
                  </PrivateRoute>
                }
              />
              <Route
                path="/bank"
                element={
                  <PrivateRoute>
                    <Bank />
                  </PrivateRoute>
                }
              />
              <Route
                path="/kyc"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/bank-detail"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
