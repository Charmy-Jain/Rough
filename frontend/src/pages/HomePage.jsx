import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaVideo, FaPhone, FaComments, FaRobot, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa"; // Call Icons
import logo from '../assets/logo.png';

function HomePage() {
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, name: 'John Doe', lastMessage: 'Hey there!', timestamp: '10:30 AM', avatar: 'https://via.placeholder.com/50/4CAF50/FFFFFF?text=JD' },
    { id: 2, name: 'Jane Smith', lastMessage: 'How are you?', timestamp: '9:15 AM', avatar: 'https://via.placeholder.com/50/4CAF50/FFFFFF?text=JS' },
    { id: 3, name: 'Group Chat', lastMessage: 'Meeting at 2 PM', timestamp: 'Yesterday', avatar: 'https://via.placeholder.com/50/4CAF50/FFFFFF?text=GC' },
    { id: 4, name: 'Support', lastMessage: "We'll get back to you soon.", timestamp: '2 days ago', avatar: 'https://via.placeholder.com/50/4CAF50/FFFFFF?text=S' },
  ]);

  const handleChatClick = (chatId) => {
    setActiveChat(chats.find(chat => chat.id === chatId));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    alert("Logged out successfully!");
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 w-full py-3 px-4 flex items-center fixed top-0 z-50 border-b border-gray-700">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-5 w-5 mr-2" />
          <span className="text-white font-medium text-sm">Chat Friendly</span>
        </div>
      </nav>

      <div className="flex-1 flex pt-[2.5rem]">
        {/* Sidebar */}
        <div className={`relative w-1/4 md:w-1/5 bg-gray-900 border-r border-gray-700 overflow-y-auto transition-all duration-300 ${showSidebar ? "w-2/5" : "w-1/4"}`}>
          <div className="p-4 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Chats</h1>
            </div>
            <button onClick={() => setShowSidebar(!showSidebar)} className="text-white text-2xl">☰</button>
          </div>

          {/* Sidebar Overlay */}
          {showSidebar && (
            <>
              <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setShowSidebar(false)}></div>
              <div
                className={`fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-700 flex flex-col justify-between transition-transform duration-300 z-50 ${
                  showSidebar ? "translate-x-0 w-64" : "-translate-x-full w-0"
                }`}
              >
                {/* Sidebar Header */}
                <div className="p-4 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
                  <h1 className="text-xl font-bold">Menu</h1>
                  <button onClick={() => setShowSidebar(false)} className="text-white text-2xl">✖</button>
                </div>

                {/* Sidebar Menu Items */}
                <div className="flex flex-col justify-between h-full">
                  <ul className="mt-4">
                    <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => navigate("/")}>
                      <FaComments className="mr-2" /> Chats
                    </li>
                    <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => navigate("/calls")}>
                      <FaPhone className="mr-2 transform rotate-90" /> Calls
                    </li>
                    <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => navigate("/ai")}>
                      <FaRobot className="mr-2" /> AI Assistant
                    </li>
                  </ul>

                  <ul className="mt-4 border-t border-gray-700">
                    <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => navigate("/profile")}>
                      <FaUser className="mr-2" /> Profile
                    </li>
                    <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => navigate("/settings")}>
                      <FaCog className="mr-2" /> Settings
                    </li>
                    <li className="px-6 py-3 hover:bg-red-600 text-red-400 cursor-pointer flex items-center" onClick={handleLogout}>
                      <FaSignOutAlt className="mr-2" /> Logout
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Search Bar */}
          <div className="p-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 bg-gray-800 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Chat List */}
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-800 ${activeChat && activeChat.id === chat.id ? "bg-green-900" : ""}`}
              onClick={() => handleChatClick(chat.id)}
            >
              <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full mr-3" />
              <div className="flex-1">
                <p className="font-semibold text-white">{chat.name}</p>
                <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
              </div>
              <p className="text-xs text-gray-500">{chat.timestamp}</p>
            </div>
          ))}
        </div>

      {/* Main Chat Window */}
      <div className="flex-1 bg-gray-800">
        {activeChat ? (
          <>
            {/* Chat Header with Call Buttons */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full mr-3" />
                <h2 className="text-lg font-semibold">{activeChat.name}</h2>
              </div>
              {/* Square Call Buttons */}
              <div className="flex gap-2">
                <button className="text-white bg-gray-700 p-3 rounded-md hover:bg-green-500 transition">
                  <FaVideo size={20} />
                </button>
                <button className="text-white bg-gray-700 p-3 rounded-md hover:bg-green-500 transition">
                  <FaPhoneAlt size={18} style={{ transform: "rotate(360deg)" }} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 overflow-y-auto h-[calc(100vh-10rem)]">
              <div className="mb-4 flex items-start">
                <div className="bg-gray-700 text-white p-3 rounded-lg max-w-xs shadow-md">
                  This is a sample message from {activeChat.name}.
                </div>
              </div>
              <p className="text-xs text-gray-500 ml-3">11:02 AM</p>

              <div className="mb-4 flex justify-end">
                <div className="bg-green-500 text-white p-3 rounded-lg max-w-xs shadow-md">
                  And here's a reply from you!
                </div>
              </div>
              <p className="text-xs text-gray-500 text-right mr-3">11:05 AM</p>
            </div>

            {/* Message Input */}
            <div className="sticky bottom-0 bg-gray-900 p-4 border-t border-gray-700 flex items-center">
              <input type="text" placeholder="Type a message..." className="flex-1 px-3 py-2 bg-gray-800 rounded-l-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none focus:shadow-outline">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-lg">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}

export default HomePage;
