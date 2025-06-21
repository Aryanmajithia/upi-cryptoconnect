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

// Request Logger Middleware (for debugging deployment)
app.use((req, res, next) => {
  console.log(`New request received: ${req.method} ${req.path}`);
  next();
});

connectDB();

// A more robust CORS configuration
const whitelist = [
  "http://localhost:3000",
  "http://localhost:6900",
  "http://localhost:5173",
];

// Add production frontend URL from environment variables if it exists
if (process.env.FRONTEND_URL) {
  whitelist.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "UPI CryptoConnect Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/money-transfer", moneyTransferRoutes);
app.use("/loan", FLRoutes);

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
