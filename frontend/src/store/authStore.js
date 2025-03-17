import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../utils/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

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
      await axiosInstance.post(`/auth/logout`, {}, { withCredentials: true }); // ✅ Ensure cookies are cleared
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
      const response = await axiosInstance.get(`/auth/check-auth`, {
        withCredentials: true,  // ✅ Sends authentication cookies
      });
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      console.error("Auth check failed:", error.response?.data || error.message);
      set({ error: "Unauthorized", isCheckingAuth: false, isAuthenticated: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/auth/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error sending reset password email", isLoading: false });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error resetting password", isLoading: false });
      throw error;
    }
  },  
}));
