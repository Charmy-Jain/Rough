import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            console.log("No token provided");
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(!decoded){
            console.log("Invalid token");
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        console.log("Decoded token", decoded);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            console.log("User not found in the database");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Authenticated user:", user);
        req.user = user;
        
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        return res.status(401).json({ message: "Internal Server Error" });
    }
}