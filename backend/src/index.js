import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import { connectDB } from "./database/config.js";
import bankRoutes from "./routes/bank.js";
import { config } from "dotenv";
import moneyTransferRoutes from "./routes/moneyTransferRoutes.js";
import FLRoutes from "./routes/flashLoan.js";

config({
  path: "./.env",
});
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/money-transfer", moneyTransferRoutes);
app.use("/loan", FLRoutes);

const PORT = process.env.PORT || 6900;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
