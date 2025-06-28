import React, { useState } from "react";
import styles from "../style";
import SendMoney from "../components/Pay";
import RequestMoney from "../components/Reqpay";
import RecentTransactions from "../components/RecentTransactions";
import Card from "../components/Card";

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-bold text-lg rounded-t-lg transition-colors duration-300
            ${
              active
                ? "bg-gray-800 border-b-4 border-blue-500 text-white"
                : "text-gray-400 hover:bg-gray-800/50"
            }`}
  >
    {children}
  </button>
);

const SendAndRequest = () => {
  const [activeTab, setActiveTab] = useState("send");

  return (
    <div className={`py-10 px-6 ${styles.boxWidth} mx-auto`}>
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white">Send & Request Crypto</h1>
        <p className="text-gray-400 mt-2">
          Manage your crypto payments with ease. Send to any UPI ID or request
          funds directly.
        </p>
      </header>

      <main>
        <div className="flex justify-center border-b border-gray-700 mb-8">
          <TabButton
            active={activeTab === "send"}
            onClick={() => setActiveTab("send")}
          >
            Send Money
          </TabButton>
          <TabButton
            active={activeTab === "request"}
            onClick={() => setActiveTab("request")}
          >
            Request Money
          </TabButton>
        </div>

        <div className="max-w-2xl mx-auto">
          {activeTab === "send" && <SendMoney />}
          {activeTab === "request" && <RequestMoney />}
        </div>
      </main>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Transaction & Request History
        </h2>
        <RecentTransactions />
      </section>
    </div>
  );
};

export default SendAndRequest;
