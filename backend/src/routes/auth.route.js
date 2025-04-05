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
import User from "../models/user.model.js"; 

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


router.get("/profile", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // make sure it's using the latest DB data
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      user: {
        name: user.name,
        status: user.status,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update-profile", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, status, profilePic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, status, profilePic },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully!",
      updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
