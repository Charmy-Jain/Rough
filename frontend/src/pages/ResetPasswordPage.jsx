import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { resetPassword, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Get `email` and `otp` from URL or localStorage
    const params = new URLSearchParams(location.search);
    const email = params.get("email") || localStorage.getItem("resetEmail");
    const otp = params.get("otp") || localStorage.getItem("resetOtp"); // ✅ Ensure OTP is retrieved correctly


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // ✅ Retrieve email & OTP from localStorage or URL
        const storedEmail = localStorage.getItem("resetEmail") || email;
        const storedOtp = localStorage.getItem("resetOtp") || otp;
    
        // 🛠 Debugging: Log the retrieved values
        console.log("🔍 Debugging Values Before Submission:");
        console.log("Email from URL:", email);
        console.log("Email from localStorage:", localStorage.getItem("resetEmail"));
        console.log("OTP from URL:", otp);
        console.log("OTP from localStorage:", localStorage.getItem("resetOtp"));
        console.log("Final Email Used:", storedEmail);
        console.log("Final OTP Used:", storedOtp);
        console.log("Password:", password);
        console.log("Confirm Password:", confirmPassword);
    
        if (!storedEmail || !storedOtp || !password || !confirmPassword) {
            toast.error("All fields are required.");
            return;
        }
    
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }
    
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
    
        try {
            const response = await resetPassword(storedEmail, storedOtp, password);
    
            if (response && response.success) {
                toast.success("Password reset successful! Redirecting to login...");
    
                // ✅ Clear localStorage after reset
                localStorage.removeItem("resetEmail");
                localStorage.removeItem("resetOtp");
    
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                throw new Error(response?.message || "Unexpected error");
            }
        } catch (error) {
            console.error("❌ Error in resetPassword:", error);
            toast.error(error.response?.data?.message || "Error resetting password");
        }
    };
    
    
      

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl mx-auto p-4 sm:p-6 md:p-8'
        >
            <div>
                <h2 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                    Reset Password
                </h2>

                <form onSubmit={handleSubmit} className="w-full">
                    <Input
                        className='w-full text-sm sm:text-base md:text-lg py-2 sm:py-3'
                        icon={Lock}
                        type='password'
                        placeholder='New Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Input
                        className='w-full text-sm sm:text-base md:text-lg py-2 sm:py-3'
                        icon={Lock}
                        type='password'
                        placeholder='Confirm New Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='w-full py-2 sm:py-3 px-4 text-sm sm:text-base md:text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
                        type='submit'
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting..." : "Set New Password"}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};

export default ResetPasswordPage;
