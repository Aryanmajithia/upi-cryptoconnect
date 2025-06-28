import express from "express";
import {
  paymentsWrite,
  paymentsRead,
} from "../controllers/paymentsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/paymentWrite", authMiddleware, paymentsWrite);
router.get("/paymentRead", authMiddleware, paymentsRead);

export default router;
