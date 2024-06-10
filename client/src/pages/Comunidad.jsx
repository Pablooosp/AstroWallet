import React, { useState, useEffect } from "react";
import CreateChat from "../components/CreateChat";
import ChatList from "../components/ChatList";
import io from "socket.io-client";
import Header from "../components/Header";
import Friends from "../components/Friends";

const socket = io("http://localhost:3000");

const Comunidad = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedChat) {
      fetch(`http://localhost:3000/api/chats/${selectedChat._id}/messages`)
        .then((response) => response.json())
        .then((data) => setMessages(data));

      socket.emit("join_chat", selectedChat._id);

      socket.on("receive_message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [selectedChat]);

  const sendMessage = (content) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userEmail = user ? user.email : null;
    if (!userEmail || !selectedChat) return;

    const newMessage = {
      chatId: selectedChat._id,
      content,
      senderEmail: userEmail,
      timestamp: new Date().toISOString(),
    };

    fetch("http://localhost:3000/api/chats/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    });

    socket.emit("send_message", {
      chatId: selectedChat._id,
      message: newMessage,
    });
  };

  return (
    <div className="w-full h-full">
      <Header></Header>
      <Friends></Friends>
      <div>
        <CreateChat onChatCreated={(chat) => setSelectedChat(chat)} />
        <ChatList onSelectChat={setSelectedChat} />
      </div>
      {selectedChat && (
        <div className="col-span-2 p-4 bg-white rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">{selectedChat.name}</h2>
          <div className="mb-4">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <p>
                  <strong>{msg.senderEmail}</strong>: {msg.content}{" "}
                  <em>{new Date(msg.timestamp).toLocaleTimeString()}</em>
                </p>
              </div>
            ))}
          </div>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Escribe tu mensaje..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim() !== "") {
                sendMessage(e.target.value);
                e.target.value = "";
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Comunidad;
