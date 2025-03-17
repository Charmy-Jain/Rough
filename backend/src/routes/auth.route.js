import express from 'express';
import { checkAuth, login, logout, signup, resetPassword, forgotPassword, verifyEmail } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { updateProfile } from '../controllers/user.controller.js';
import {verifyToken} from '../middleware/verifyToken.js'

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "Auth API is working!" });
});

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);

router.post('/verify-email',verifyEmail);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:token',resetPassword);

router.get("/check-auth", verifyToken, checkAuth);

router.put ('/update-profile', protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);


router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


export default router;