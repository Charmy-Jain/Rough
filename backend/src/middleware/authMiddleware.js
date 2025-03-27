import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// ✅ Middleware to verify JWT Token
export const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
    }
};

// ✅ Middleware to Protect Routes (Requires Authenticated User)
export const protectRoute = async (req, res, next) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
        }

        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user; // Store user data in request object
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
