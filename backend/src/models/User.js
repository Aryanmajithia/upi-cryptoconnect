import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    walletAddress: {
      type: String,
      default: null,
    },
    upiId: {
      type: String,
      default: null,
    },
    bankAccount: {
      type: String,
      default: null,
    },
    ifscCode: {
      type: String,
      default: null,
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactionCount: {
      type: Number,
      default: 0,
    },
    preferredCurrency: {
      type: String,
      default: "INR",
    },
    age: {
      type: Number,
    },
    dob: {
      type: Date,
    },
    status: {
      type: String,
      default: "active",
    },
    mobile: {
      type: String,
    },
    metamaskId: {
      type: String,
      default: null,
    },
    kyc: {
      type: Boolean,
      default: false,
    },
    isWalletConnected: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", UserSchema);

export default User;
