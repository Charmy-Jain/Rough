import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();

  // Simulated user data (Replace with API call)
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    status: "Hey there! I'm using this chat app.",
    avatar: "https://via.placeholder.com/100/4CAF50/FFFFFF?text=JD", // Replace with actual image URL
  });

  const [newName, setNewName] = useState(user.name);
  const [newStatus, setNewStatus] = useState(user.status);
  const [image, setImage] = useState(null);

  // Handle Profile Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  // Handle Save Changes
  const handleSaveChanges = () => {
    setUser({ ...user, name: newName, status: newStatus, avatar: image || user.avatar });
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-green-900 via-gray-900 to-black text-white p-4">
      
      {/* Profile Card - Responsive Width */}
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-2xl border border-gray-700 ring-1 ring-green-600/40 relative">
        
        {/* Back Button at Top-Left */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-white bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700 transition"
        >
          ←
        </button>

        {/* Profile Header */}
        <div className="text-center mb-6 mt-2">
          <h1 className="text-2xl font-bold text-green-500">Profile</h1>
          <p className="text-gray-400">Update your details</p>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <img
              src={image || user.avatar}
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

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Status Input */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Status</label>
          <input
            type="text"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Email (Read-only) */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-3 py-2 bg-gray-700 rounded-md text-gray-400 focus:outline-none"
          />
        </div>

        {/* Save Button (Smaller & Right-Aligned) */}
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
