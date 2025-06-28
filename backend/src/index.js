import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import { connectDB } from "./database/config.js";
import bankRoutes from "./routes/bank.js";
import { config } from "dotenv";
import moneyTransferRoutes from "./routes/moneyTransferRoutes.js";
import FLRoutes from "./routes/flashLoan.js";
import paymentRoutes from "./routes/payments.js";
import authMiddleware from "./middleware/authMiddleware.js";
import { serverConfig, rateLimitConfig } from "./config.js";

config({
  path: "./.env",
});

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit(rateLimitConfig);
app.use(limiter);

// Request Logger Middleware (for debugging deployment)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database connection
connectDB();

// CORS configuration
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
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600, // 10 minutes
};

app.use(cors(corsOptions));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    headers: req.headers,
  });

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "UPI CryptoConnect Backend is running",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    port: process.env.PORT || "not set",
  });
});

// Test endpoint for debugging
app.get("/test", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
    routes: [
      "/api/auth/register",
      "/api/auth/login",
      "/api/auth/verify",
      "/api/bank/add",
      "/api/bank/upi-send",
    ],
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    uptime: process.uptime(),
  });
});

// Test authentication endpoint
app.get("/api/test-auth", authMiddleware, (req, res) => {
  res.json({
    status: "ok",
    message: "Authentication working",
    user: req.user,
  });
});

// Test profile update endpoint
app.get("/api/test-profile", (req, res) => {
  res.json({
    status: "ok",
    message: "Profile endpoint accessible",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/money-transfer", moneyTransferRoutes);
app.use("/api/loans", FLRoutes);
app.use("/api/pay", paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = serverConfig.port;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
