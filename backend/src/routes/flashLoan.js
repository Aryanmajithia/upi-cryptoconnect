import express from "express";
import {
  FLHistoryRead,
  FLHistoryWrite,
  getLoanHistory,
  getBalance,
  withdraw,
  lockArena,
  findArbitrage,
  executeFlashLoan,
} from "../controllers/flashLoanController.js";

const router = express.Router();

// New API endpoints
router.get("/history", getLoanHistory);
router.get("/balance", getBalance);
router.post("/withdraw", withdraw);
router.post("/lock", lockArena);
router.post("/flash", findArbitrage);
router.post("/execute", executeFlashLoan);

// Legacy endpoints for backward compatibility
router.post("/historyRead", FLHistoryRead);
router.post("/historyWrite", FLHistoryWrite);

export default router;
