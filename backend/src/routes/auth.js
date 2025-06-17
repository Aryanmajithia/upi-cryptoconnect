import express from "express";
const router = express.Router();
import {
  register,
  login,
  linking,
  details,
  update,
  fetchUserDetails,
} from "../controllers/authController.js";

router.post("/register", register);
router.post("/login", login);
router.post("/linking", linking);
router.post("/updatedet", update);
router.post("/fetchdetail", fetchUserDetails);

export default router;
