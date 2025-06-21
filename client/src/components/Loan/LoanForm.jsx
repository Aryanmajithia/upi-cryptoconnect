import React from "react";
import Card from "../Card";
import Input from "../forms/Input";
import Button from "../Button";

const LoanForm = ({ loanAmount, setLoanAmount, onFlash, loading }) => (
  <Card>
    <h3 className="text-lg font-semibold text-white mb-4">
      Request a Flash Loan
    </h3>
    <div className="space-y-4">
      <Input
        label="Loan Amount (USDC)"
        name="loanAmount"
        type="number"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
        placeholder="e.g., 1000"
      />
      <Button onClick={onFlash} disabled={loading} className="w-full">
        {loading ? "Searching for Opportunities..." : "Find Arbitrage"}
      </Button>
    </div>
  </Card>
);

export default LoanForm;
