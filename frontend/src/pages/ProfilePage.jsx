import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/authStore";
import defaultAvatar from "../assets/avtar.png";


function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore(); // Access user from the store

  // Initialize states based on the current user's data
  const [newName, setNewName] = useState(user?.name || "");
  const [newStatus, setNewStatus] = useState(user?.status || "");
  const [image, setImage] = useState(user?.profilePic || null);

  // Optional: Fetch latest user data if needed
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setNewName(response.data.user.name); // Sync name
        setNewStatus(response.data.user.status); // Sync status
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle Profile Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  // Handle Save Changes
  const handleSaveChanges = async () => {
    try {
        const response = await axiosInstance.put(
            "/auth/update-profile",
            {
                name: newName,
                status: newStatus,
                profilePic: image || user?.profilePic, // Optional profilePic
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
        );
        const updatedUser = response.data.updatedUser;

        // Optionally update the UI with new values
        setNewName(updatedUser.name);
        setNewStatus(updatedUser.status);
        setImage(updatedUser.profilePic);

        alert("Profile updated successfully!");
    } catch (error) {
        console.error("Error updating profile:", error.message);
        alert("Failed to update profile. Please try again.");
    }
};

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-green-900 via-gray-900 to-black text-white p-4">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-2xl border border-gray-700 ring-1 ring-green-600/40 relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-white bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700 transition"
        >
          ←
        </button>
        <div className="text-center mb-6 mt-2">
          <h1 className="text-2xl font-bold text-green-500">Profile</h1>
          <p className="text-gray-400">Update your details</p>
        </div>
        <div className="flex justify-center mb-4">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <img
              src={image || user?.profilePic || defaultAvatar}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-green-500 hover:border-blue-500 transition"
            />
          </label>
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Status</label>
          <input
            type="text"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={user?.email || "Loading email..."}
            disabled
            className="w-full px-3 py-2 bg-gray-700 rounded-md text-gray-400 focus:outline-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSaveChanges}
            className="bg-green-500 px-3 py-2 rounded-md text-white hover:bg-green-600 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;