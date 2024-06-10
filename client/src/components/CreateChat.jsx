import React, { useState, useEffect } from 'react';

const CreateChat = ({ onChatCreated }) => {
  const [chatName, setChatName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user ? user.email : null;

    if (!userEmail) return;

    fetch(`http://localhost:3000/api/users/${userEmail}/friends`)
      .then((response) => response.json())
      .then((data) => setFriends(data));
  }, []);

  const handleCreateChat = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user ? user.email : null;
    if (!userEmail) return;

    const userEmails = [userEmail, ...selectedFriends];
    fetch('http://localhost:3000/api/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: chatName, userEmails }),
    })
      .then((response) => response.json())
      .then((data) => {
        setChatName('');
        setSelectedFriends([]);
        onChatCreated(data);
      });
  };

  const toggleFriendSelection = (friendEmail) => {
    setSelectedFriends((prevSelectedFriends) =>
      prevSelectedFriends.includes(friendEmail)
        ? prevSelectedFriends.filter((email) => email !== friendEmail)
        : [...prevSelectedFriends, friendEmail]
    );
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Crear Chat</h2>
      <input
        type="text"
        className="w-full p-2 mb-4 border rounded"
        placeholder="Nombre del Chat"
        value={chatName}
        onChange={(e) => setChatName(e.target.value)}
      />
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Selecciona Amigos</h3>
        <ul className="max-h-40 overflow-y-auto">
          {friends.map((friend) => (
            <li key={friend.email} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedFriends.includes(friend.email)}
                onChange={() => toggleFriendSelection(friend.email)}
              />
              <span>{friend.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleCreateChat}
      >
        Crear Chat
      </button>
    </div>
  );
};

export default CreateChat;
