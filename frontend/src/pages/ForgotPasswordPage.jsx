import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail, Key } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const navigate = useNavigate();

    const { isLoading, forgotPassword, verifyOtp } = useAuthStore();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        await forgotPassword(email);
        setShowOtpInput(true);
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const resetToken = await verifyOtp(email, otp); // Call API
    
            console.log("✅ Response from verifyOtp:", resetToken); // Debugging
    
            if (!resetToken) {
                throw new Error("Invalid OTP or response is empty.");
            }
    
            // ✅ Store OTP & Email in localStorage
            localStorage.setItem("resetEmail", email);
            localStorage.setItem("resetOtp", otp);
    
            console.log("✅ OTP & Email stored in localStorage:");
            console.log("Email:", localStorage.getItem("resetEmail"));
            console.log("OTP:", localStorage.getItem("resetOtp"));
    
            // ✅ Redirect to Reset Password Page
            navigate(`/reset-password?email=${email}&otp=${otp}`);
        } catch (error) {
            console.error("❌ Error in verifyOtp:", error);
            toast.error("Invalid OTP. Please try again.");
        }
    };
    
    
    

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
        >
            <div className='p-8'>
                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                    Forgot Password
                </h2>

                {!showOtpInput ? (
                    <form onSubmit={handleEmailSubmit}>
                        <p className='text-gray-300 mb-6 text-center'>
                            Enter your email address and we'll send you an OTP to reset your password.
                        </p>
                        <Input
                            className='w-full text-sm sm:text-base md:text-lg py-2 sm:py-3'
                            icon={Mail}
                            type='email'
                            placeholder='Email Address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full py-2 sm:py-3 px-4 text-sm sm:text-base md:text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition duration-200'
                            type='submit'
                        >
                            {isLoading ? <Loader className='w-5 h-5 animate-spin mx-auto' /> : "Send OTP"}
                        </motion.button>
                    </form>
                ) : (
                    <form onSubmit={handleOtpSubmit}>
                        <Input
                            className='w-full text-sm sm:text-base md:text-lg py-2 sm:py-3'
                            icon={Key}
                            type='text'
                            placeholder='Enter OTP'
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full py-2 sm:py-3 px-4 text-sm sm:text-base md:text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition duration-200'
                            type='submit'
                        >
                            {isLoading ? <Loader className='w-5 h-5 animate-spin mx-auto' /> : "Verify OTP"}
                        </motion.button>
                    </form>
                )}
            </div>

            <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                <Link to={"/login"} className='text-sm text-green-400 hover:underline flex items-center'>
                    <ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
                </Link>
            </div>
        </motion.div>
    );
};

export default ForgotPasswordPage;
