import express from "express";
import {
  addBankDetails,
  getAllUsers,
  linking,
  sendUPITransaction,
  getTransactionHistory,
  receiveUPITransaction,
} from "../controllers/bankcontoller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getLoggedUserDetails } from "../controllers/bankcontoller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post("/add", addBankDetails);
router.get("/all-users", getAllUsers);
router.get("/user-details", getLoggedUserDetails);
router.post("/linking", linking);

// New UPI transaction routes
router.post("/upi-send", sendUPITransaction);
router.get("/transactions", getTransactionHistory);
router.post("/upi-receive", receiveUPITransaction);

export default router;
