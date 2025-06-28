import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtSecret } from "../config.js";

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      console.log("Auth middleware: No Authorization header");
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token format
    if (!authHeader.startsWith("Bearer ")) {
      console.log("Auth middleware: Invalid token format");
      return res.status(401).json({
        success: false,
        message: "Invalid token format. Use Bearer scheme.",
      });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("Auth middleware: Processing token");

    try {
      // Verify token
      const decoded = jwt.verify(token, jwtSecret);
      console.log("Auth middleware: Token decoded:", {
        userId: decoded.user?.id,
        decoded,
      });

      // Get user from database
      const user = await User.findById(decoded.user.id).select("-password");
      if (!user) {
        console.log("Auth middleware: User not found for ID:", decoded.user.id);
        return res.status(401).json({
          success: false,
          message: "User not found or token is invalid",
        });
      }

      console.log("Auth middleware: User found:", {
        userId: user._id,
        email: user.email,
      });
      // Add user to request
      req.user = user;
      next();
    } catch (err) {
      console.log("Auth middleware: Token verification failed:", err.message);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired",
        });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }
      throw err;
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default authMiddleware;
