import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import {
    sendResetSuccessEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
	sendPasswordResetOTPEmail,
} from '../mailtrap/emails.js';


export const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});

		await user.save();

		// jwt
		const token = generateToken(user._id);

		res.cookie('token',token,{
			httOnly:true,
			secure:process.env.NODE_ENV === 'production',
			sameSite:"strict",
			maxAge:7 * 24 * 60 *60 * 1000
		});

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		const token = generateToken(user._id);
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});


		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				_id: user._id,
				email: user.email,
				name: user.name,
				lastLogin: user.lastLogin,
				isVerified: user.isVerified,
				profilePic: user.profilePic,
			},
		});
		
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token", {
	  httpOnly: true,
	  secure: process.env.NODE_ENV === "production",
	  sameSite: "strict",
	});
	res.status(200).json({ success: true, message: "Logged out successfully" });
};
  

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // ✅ Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

        // ✅ Save OTP in the database
        user.resetPasswordToken = otp;
        user.resetPasswordExpiresAt = otpExpiresAt;
        await user.save();

        // ✅ Send OTP via email
        await sendPasswordResetOTPEmail(user.email, otp);

        res.status(200).json({ success: true, message: "OTP sent to your email", email });
    } catch (error) {
        console.log("❌ Error in forgotPassword", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};


export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.resetPasswordToken !== otp || user.resetPasswordExpiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // ✅ Generate Reset Token
        const resetToken = crypto.randomBytes(20).toString('hex');

        console.log("✅ Reset Token Generated:", resetToken); // Debugging

        // ✅ Send Reset Token in Response
        res.status(200).json({ success: true, resetToken });
    } catch (error) {
        console.log("Error in verifyOtp", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};


export const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.resetPasswordToken !== otp || user.resetPasswordExpiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password & clear OTP
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetPassword", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};



export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });  
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true});

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfile controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};


