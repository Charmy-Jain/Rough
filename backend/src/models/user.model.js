import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: "Hey there! I'm using Chat Friendly.", 
        },    
        password: { 
            type: String,
            required: true
        },
        lastLogin: {
            type: Date,
            default: Date.now
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        profilePic: {
            type: String,
            default: "/assets/default-avatar.png",
        },
        resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date
    },
    { timestamps: true }
);


const User = mongoose.model("User", userSchema);

export default User;
