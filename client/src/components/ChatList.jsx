import React, { useState, useEffect } from 'react';

const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user ? user.email : null;

    if (!userEmail) return;

    fetch(`http://localhost:3000/api/chats/user/${userEmail}`)
      .then((response) => response.json())
      .then((data) => setChats(data));
  }, []);

  return (
    <div className="p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Tus Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat._id}
            className="p-2 mb-2 border rounded cursor-pointer hover:bg-gray-100"
            onClick={() => onSelectChat(chat)}
          >
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
