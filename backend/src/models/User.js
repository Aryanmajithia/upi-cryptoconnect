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
    preferredCurrency: { type: String, default: "USD" },
    age: { type: Number },
    dob: { type: Date },
    address: { type: String },
    status: { type: String },
    mobile: { type: String },
    metamaskId: {
      type: String,
      default: null,
    },
    upiId: {
      type: String,
      default: null,
    },
    kyc: { type: Boolean, default: false },
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
