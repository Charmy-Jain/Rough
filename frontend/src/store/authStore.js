import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../utils/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  // isLoading: false,
  isCheckingAuth: true,
  // message: null,

  updateUser: (updatedUser) => set({ user: updatedUser }),

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/auth/signup`, { email, password, name });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
        const response = await axiosInstance.post(`/auth/login`, { email, password });

        localStorage.setItem("token", response.data.token);

        set({
            isAuthenticated: true,
            user: response.data.user,
            error: null,
            isLoading: false,
        });
    } catch (error) {
        set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
        throw error;
    }
  },


  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post(`/auth/logout`, {}, { withCredentials: true });
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/auth/verify-email`, { code });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
        const response = await axiosInstance.get('/auth/check-auth', {
            withCredentials: true, 
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
        });

        set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
        console.error("❌ Auth check failed:", error.response?.data || error.message);
        set({ error: "Unauthorized", isCheckingAuth: false, isAuthenticated: false });
    }
  },



  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });

    try {
        const response = await axiosInstance.post(`/auth/forgot-password`, { email });

        set({ message: response.data.message, isLoading: false });
        return response.data;
    } catch (error) {
        console.error("❌ Error in forgotPassword API:", error.response?.data || error.message);
        set({ error: error.response?.data?.message || "Failed to send OTP", isLoading: false });
        throw error;
    }
},


resetPassword: async (email, otp, password) => {
  set({ isLoading: true, error: null });

  if (!email || !otp || !password) {
      set({ error: "All fields are required", isLoading: false });
      return { success: false, message: "All fields are required" };
  }

  try {
      const response = await axiosInstance.post(`/auth/reset-password`, {
          email,
          otp,
          password,
      });

      set({ message: response.data.message, isLoading: false });
      return response.data;
  } catch (error) {
      console.error("❌ Error in resetPassword API:", error.response?.data || error.message);
      set({ error: error.response?.data?.message || "Failed to reset password", isLoading: false });
      return { success: false, message: error.response?.data?.message || "Failed to reset password" };
  }
},


verifyOtp: async (email, otp) => {
  set({ isLoading: true, error: null });

  try {
      const response = await axiosInstance.post(`/auth/verify-otp`, { email, otp });
      set({ message: "OTP verified", isLoading: false });

      return response.data.resetToken; 
  } catch (error) {
      set({ error: "Invalid or expired OTP", isLoading: false });
      throw error;
  }
},


}));
