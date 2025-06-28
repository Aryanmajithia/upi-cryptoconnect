import express from "express";
const router = express.Router();
import {
  register,
  login,
  linking,
  details,
  update,
  fetchUserDetails,
  verifyToken,
  updateProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/register", register);
router.post("/login", login);
router.post("/linking", linking);
router.post("/updatedet", update);
router.post("/fetchdetail", fetchUserDetails);
router.get("/verify", authMiddleware, verifyToken);
router.put("/update-profile", authMiddleware, updateProfile);

export default router;
