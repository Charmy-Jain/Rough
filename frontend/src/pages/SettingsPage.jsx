import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function SettingsPage() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  // Sample settings states
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="flex h-screen w-screen bg-black text-white">
      {/* Left Sidebar */}
      <div
        className={`relative w-1/4 md:w-1/5 bg-gray-900 border-r border-gray-700 overflow-y-auto transition-all duration-300 ${
          showSidebar ? "w-2/5" : "w-1/4"
        }`}
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-10 h-10 mr-2 rounded" />
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
          <button onClick={() => setShowSidebar(!showSidebar)} className="text-white text-2xl">
            ☰
          </button>
        </div>

        {/* Sidebar Menu */}
        {showSidebar && (
          <div className="absolute left-0 top-0 w-full h-full bg-gray-900 z-20 shadow-lg">
            <button onClick={() => setShowSidebar(false)} className="text-white text-2xl p-4">
              ✖
            </button>
            <ul className="mt-4">
              <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/profile")}>
                👤 Profile
              </li>
              <li className="px-6 py-3 bg-gray-800 cursor-pointer">⚙️ Settings</li>
              <li className="px-6 py-3 hover:bg-red-600 text-red-400 cursor-pointer" onClick={() => navigate("/login")}>
                🚪 Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Main Settings Content */}
      <div className="flex-1 bg-gray-800 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-green-400">Settings</h2>

        {/* Notifications Toggle */}
        <div className="flex justify-between items-center bg-gray-900 p-4 rounded-lg mb-4">
          <span className="text-white">🔔 Notifications</span>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full flex items-center px-1 ${
              notifications ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition ${
                notifications ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex justify-between items-center bg-gray-900 p-4 rounded-lg mb-4">
          <span className="text-white">🌙 Dark Mode</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full flex items-center px-1 ${
              darkMode ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition ${
                darkMode ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </button>
        </div>

        {/* Account Section */}
        <div className="bg-gray-900 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold text-white">Account</h3>
          <p className="text-gray-400 text-sm mt-2">Manage your account settings.</p>
          <button
            onClick={() => navigate("/profile")}
            className="mt-3 bg-green-500 px-4 py-2 rounded-md text-white hover:bg-green-600 transition"
          >
            Edit Profile
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-red-500 px-4 py-2 rounded-md text-white hover:bg-red-600 transition mt-4"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
