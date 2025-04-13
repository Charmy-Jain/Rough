import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/authStore";
import defaultAvatar from "../assets/avtar.png";


function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore(); 

  // Initialize states based on the current user's data
  const [newName, setNewName] = useState(user?.name || "");
  const [newStatus, setNewStatus] = useState(user?.status || "");
  const [image, setImage] = useState(user?.profilePic || null);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showPicOptions, setShowPicOptions] = useState(false);
  const [viewImage, setViewImage] = useState(false);

  // Optional: Fetch latest user data if needed
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setNewName(response.data.user.name); 
        setNewStatus(response.data.user.status);
        setImage(response.data.user.profilePic);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };
  
  //Handle Save Changes
  const handleSaveChanges = async () => {
    try {
        const updatedData = {};

        if (newName !== user?.name) updatedData.name = newName;
        if (newStatus !== user?.status) updatedData.status = newStatus;
        if (image !== user?.profilePic) updatedData.profilePic = image;

        if (Object.keys(updatedData).length === 0) {
            alert("No changes made.");
            return;
        }

        const response = await axiosInstance.put("/auth/update-profile", updatedData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        console.log("✅ Full Response from Backend:", response.data);

        const updatedUser = response.data?.updatedUser;

        if (updatedUser) {
            console.log("✅ Updated User Received:", updatedUser);

            setNewName(updatedUser.name);
            setNewStatus(updatedUser.status);
            setImage(updatedUser.profilePic);

            useAuthStore.getState().updateUser(updatedUser);

            alert("Profile updated successfully!");
        } else {
            console.warn("❌ No updated user received from backend, check response.");
            alert(response.data?.message || "Profile updated, but data might be stale.");
        }
    } catch (error) {
        console.error("❌ Error updating profile:", error.response?.data || error.message);
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
          <p className="text-gray-400">Manage your profile information</p>
        </div>

        {/* 3-dots menu */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowAccountInfo(!showAccountInfo)}
            className="text-gray-300  hover:bg-gray-700 transition focus:outline-none px-3 py-2 rounded-md text-lg"
            style={{ fontSize: "24px" }}
          >
            &#x22EE; 
          </button>
        </div>

        {/* Account Information Box */}
        {showAccountInfo && (
          <div className="absolute top-12 right-4 w-64 bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{user.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        )}
        <div className="relative flex justify-center mb-4">
          {/* Profile Picture */}
          <button
            onClick={() => setShowPicOptions(!showPicOptions)} // Toggle options dropdown
            className="cursor-pointer"
          >
            <img
              src={image || user?.profilePic || defaultAvatar}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 border-green-500 hover:border-blue-500 transition"
            />
          </button>

          {/* Options Dropdown */}
          {showPicOptions && (
            <div className="absolute top-24 bg-gray-800 p-2 rounded-md shadow-lg text-sm">
              <button
                onClick={() => {
                  setViewImage(true); // Open image view modal
                  setShowPicOptions(false); // Close dropdown
                }}
                className="block w-full text-left text-gray-300 hover:text-green-500 transition px-2 py-1"
              >
                View Image
              </button>
              <label
                htmlFor="avatar-upload"
                className="block w-full text-left text-gray-300 hover:text-green-500 transition px-2 py-1 cursor-pointer"
              >
                Change Image
              </label>
            </div>
          )}

          {viewImage && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-90 z-50">
              <button
                onClick={() => setViewImage(false)} // Close the modal
                className="absolute top-8 right-8 text-white bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 transition"
              >
                Close
              </button>
              <img
                src={image || user?.profilePic || defaultAvatar}
                alt="Profile"
                className="max-w-full max-h-full object-contain rounded-md"
              />
            </div>
          )}

          {/* Hidden File Input (For Changing Image) */}
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