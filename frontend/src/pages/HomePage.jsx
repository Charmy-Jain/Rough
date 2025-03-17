import React, { useState } from 'react';

function HomePage() {
  const [activeChat, setActiveChat] = useState(null); //  Simulate an active chat.  Replace with real chat object later.
  const [chats, setChats] = useState([ // Simulate a list of chats. Replace with actual data.
    { id: 1, name: 'John Doe', lastMessage: 'Hey there!', timestamp: '10:30 AM', avatar: 'https://via.placeholder.com/50/4CAF50/FFFFFF?text=JD' },  // Green placeholder
    { id: 2, name: 'Jane Smith', lastMessage: 'How are you?', timestamp: '9:15 AM', avatar: 'https://via.placeholder.com/50/4CAF50/FFFFFF?text=JS' }, // Green placeholder
    { id: 3, name: 'Group Chat', lastMessage: 'Meeting at 2 PM', timestamp: 'Yesterday', avatar: 'https://via.placeholder.com/50/4CAF50/FFFFFF?text=GC' }, // Green placeholder
    { id: 4, name: 'Support', lastMessage: 'We\'ll get back to you soon.', timestamp: '2 days ago', avatar: 'https://via.placeholder.com/50/4CAF50/FFFFFF?text=S' },  //Green placeholder
  ]);

  const handleChatClick = (chatId) => {
    // In a real app, this would fetch the actual chat data.
    setActiveChat(chats.find(chat => chat.id === chatId));
  };

  const handleNewChat = () => {
    // Placeholder for new chat functionality
    alert("New chat functionality would go here.");
  };


  return (
    <div className="flex h-screen w-screen bg-black text-white">

      {/* Sidebar (Chat List) */}
      <div className="w-1/4 md:w-1/5 bg-gray-900 border-r border-gray-700 overflow-y-auto">
        <div className="p-4 sticky top-0 bg-gray-900 z-10">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Chats</h1>
            <button
             onClick={handleNewChat}
             className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"  >
              New Chat
            </button>
         </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 bg-gray-800 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-800 ${activeChat && activeChat.id === chat.id ? 'bg-green-900' : ''}`}
            onClick={() => handleChatClick(chat.id)}>
            <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-1">
              <p className="font-semibold">{chat.name}</p>
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
             <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 z-10">
            <div className="flex items-center">
                <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full mr-3" />
                <h2 className="text-lg font-semibold">{activeChat.name}</h2>
            </div>
        </div>
          <div className="p-4 overflow-y-auto h-[calc(100vh-6rem)]">
            {/* Chat messages would go here (Dummy messages for now) */}
            <div className="mb-4">
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-lg p-3 max-w-xs">
                  This is a sample message from {activeChat.name}.
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-3">11:02 AM</p>
            </div>
            <div className="mb-4">
              <div className="flex justify-end">
                <div className="bg-green-500 rounded-lg p-3 max-w-xs">
                  And here's a reply from you!
                </div>
              </div>
               <p className="text-xs text-gray-500 mt-1 mr-3 text-right">11:05 AM</p>

            </div>
             <div className="mb-4">
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-lg p-3 max-w-xs">
                    Another Message
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-3">11:06 AM</p>
            </div>

          </div>

          <div className="sticky bottom-0 bg-gray-900 p-4 border-t border-gray-700">
            <div className="flex">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-gray-800 rounded-l-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none focus:shadow-outline">
                Send
              </button>
            </div>
          </div>
         </>
         ):(
          <div className="flex items-center justify-center h-full">
           <p className="text-gray-400 text-lg">Select a chat to start messaging</p>
        </div>
         )}
      </div>

    </div>
  );
}

export default HomePage;