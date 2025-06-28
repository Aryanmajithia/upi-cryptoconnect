import express from "express";
import {
  addTransaction,
  getTransactions,
  getFilteredTransactions,
  deleteTransaction,
  getIncome,
  getTransactionsByUser,
} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addTransaction);
router.get("/", authMiddleware, getTransactions);
router.get("/user/:email", authMiddleware, getTransactionsByUser);
router.delete("/:id", authMiddleware, deleteTransaction);
router.post("/filtered", authMiddleware, getFilteredTransactions);
router.get("/income/:month", authMiddleware, getIncome);

export default router;
