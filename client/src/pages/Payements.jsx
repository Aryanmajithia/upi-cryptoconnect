import React from "react";
import Layout from "../components/Layout";
import SendMoney from "../components/Pay";
import RequestMoney from "../components/Reqpay";
import RecentActivity from "../components/RecentTransactions";

const SendRequest = () => {
  return (
    <Layout>
      <div className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SendMoney />
          <RequestMoney />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">
            Recent Activity
          </h2>
          <RecentActivity />
        </div>
      </div>
    </Layout>
  );
};

export default SendRequest;
