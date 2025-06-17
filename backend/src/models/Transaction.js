import mongoose from "mongoose";

const { Schema, model } = mongoose;

const allowedCategories = [
  "Salary",
  "Groceries",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Travel",
  "Dining",
  "Education",
  "Investment",
  "Miscellaneous",
];

const TransactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: "USD",
  },
  category: {
    type: String,
    enum: allowedCategories,
    required: true,
  },
  description: {
    type: String,
  },
  transactionType: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  income: { type: Schema.Types.ObjectId, ref: "Income" }, // Reference to Income model
});

const Transaction = model("Transaction", TransactionSchema);

export default Transaction;
