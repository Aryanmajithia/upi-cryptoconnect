import React from "react";
import styles from "../style";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RecentTransactions from "../components/RecentTransactions";
import WalletManager from "../components/WalletManager";
import Button from "../components/Button";
import Card from "../components/Card";
import {
  FiArrowRight,
  FiSend,
  FiPlusCircle,
  FiTrendingUp,
  FiBriefcase,
} from "react-icons/fi";

const FeatureCard = ({ icon, title, description, link }) => (
  <Link to={link}>
    <Card className="hover:border-blue-500 transition-colors duration-300 h-full flex flex-col">
      <div className="flex items-center text-blue-400 mb-3">
        {icon}
        <h3 className="text-xl font-bold text-white ml-3">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm flex-grow">{description}</p>
      <div className="flex items-center text-sm text-blue-400 mt-4">
        Go to {title} <FiArrowRight className="ml-2" />
      </div>
    </Card>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();

  // Fallback for user name if not available
  const userName = user?.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="bg-primary w-full overflow-hidden min-h-screen">
      <main className={`py-10 px-6 ${styles.boxWidth} mx-auto`}>
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white">
            Welcome back, <span className="text-gradient">{userName}</span>!
          </h1>
          <p className="text-gray-400 mt-2">
            Here's your financial summary and quick access to our services.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link to="/send-and-request">
                  <Card className="hover:border-blue-500 transition-colors duration-300">
                    <div className="flex items-center">
                      <FiSend className="text-3xl text-blue-400" />
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-white">
                          Send Money
                        </h3>
                        <p className="text-gray-400">
                          Instantly send crypto via UPI ID.
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
                <Link to="/send-and-request">
                  <Card className="hover:border-green-500 transition-colors duration-300">
                    <div className="flex items-center">
                      <FiPlusCircle className="text-3xl text-green-400" />
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-white">
                          Request Money
                        </h3>
                        <p className="text-gray-400">
                          Request payment from others.
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </section>

            {/* Other Features */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Explore Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                  icon={<FiBriefcase size={24} />}
                  title="Flash Loans"
                  description="Access decentralized loans instantly for arbitrage or collateral swapping."
                  link="/loans"
                />
                <FeatureCard
                  icon={<FiTrendingUp size={24} />}
                  title="Crypto Tracker"
                  description="Monitor the crypto market with real-time price data and charts."
                  link="/crypto"
                />
                <FeatureCard
                  icon={<FiBriefcase size={24} />}
                  title="Bank & KYC"
                  description="Manage your linked bank accounts and complete your KYC verification."
                  link="/KYC"
                />
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Recent Activity
              </h2>
              <RecentTransactions />
            </section>
          </div>

          {/* Sidebar - Wallet Manager */}
          <div className="lg:col-span-1">
            <WalletManager />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
