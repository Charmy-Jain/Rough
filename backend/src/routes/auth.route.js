import express from "express";
import { 
    checkAuth, 
    login, 
    logout, 
    signup, 
    resetPassword, 
    forgotPassword, 
    verifyEmail, 
    verifyOtp 
} from "../controllers/auth.controller.js";

import { verifyToken, protectRoute } from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// ✅ Auth & Profile
router.get("/check-auth", verifyToken, checkAuth);
router.put("/update-profile", protectRoute, updateProfile);

export default router;
