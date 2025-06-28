import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Server configuration
export const serverConfig = {
  port: process.env.PORT || 6900,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};

// Database configuration
export const dbConfig = {
  mongoUrl: process.env.MONGO_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};

// JWT configuration
export const jwtSecret =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
export const jwtConfig = {
  secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  expiresIn: "7d",
  refreshExpiresIn: "30d",
};

// Cookie configuration
export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};

// Validation configuration
export const validationConfig = {
  password: {
    minLength: 6,
    maxLength: 50,
  },
  username: {
    minLength: 3,
    maxLength: 30,
  },
};

// Error messages
export const errorMessages = {
  auth: {
    invalidCredentials: "Invalid email or password",
    userNotFound: "User not found",
    emailTaken: "Email is already registered",
    invalidToken: "Invalid or expired token",
    unauthorized: "Unauthorized access",
  },
  validation: {
    invalidEmail: "Please enter a valid email address",
    passwordTooShort: `Password must be at least ${validationConfig.password.minLength} characters long`,
    passwordTooLong: `Password must not exceed ${validationConfig.password.maxLength} characters`,
    requiredField: "This field is required",
  },
  server: {
    internal: "Internal server error",
    notFound: "Resource not found",
    badRequest: "Bad request",
  },
};
