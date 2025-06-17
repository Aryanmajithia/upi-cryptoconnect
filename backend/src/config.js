import dotenv from "dotenv";
dotenv.config();

// Database configuration
const mongoURI =
  process.env.MONGO_URL || "mongodb://localhost:27017/upi-cryptoconnect";

// JWT configuration
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret_key_here";

// API Keys
const currencyApiKey = process.env.CURRENCY_API_KEY || "your_currency_api_key";
const cryptoApiKey = process.env.CRYPTO_API_KEY || "your_crypto_api_key";

// Payment Gateway
const razorpay_key_id =
  process.env.RAZORPAY_KEY_ID || "rzp_test_j1evu9RVxuBdwx";
const razorpay_key_secret =
  process.env.RAZORPAY_KEY_SECRET || "wSau6JRBrjKLS5DlX5HZaBJE";

export {
  mongoURI,
  jwtSecret,
  currencyApiKey,
  cryptoApiKey,
  razorpay_key_id,
  razorpay_key_secret,
};
