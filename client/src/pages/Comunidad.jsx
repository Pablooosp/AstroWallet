import React, { useState, useEffect, useRef } from "react";
import CreateChat from "../components/CreateChat";
import ChatList from "../components/ChatList";
import io from "socket.io-client";
import Header from "../components/Header";
import Friends from "../components/Friends";

const socket = io("http://localhost:3000");

const Comunidad = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      fetch(`http://localhost:3000/api/chats/${selectedChat._id}/messages`)
        .then((response) => response.json())
        .then((data) => {
          setMessages(data);
        });

      socket.emit("join_chat", selectedChat._id);

      socket.on("receive_message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = (content) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userEmail = user ? user.email : null;
    const userName = user ? user.name : null;
    if (!userEmail || !selectedChat) return;

    const newMessage = {
      chatId: selectedChat._id,
      content,
      senderEmail: userEmail,
      timestamp: new Date().toISOString(),
      sender: { name: userName } // Incluir el remitente del mensaje
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
    <div className="w-full h-[80%]">
      <Header />
      <section className="flex w-full h-[85%] justify-between">
        <div className="w-1/4 p-4">
          <ChatList onSelectChat={setSelectedChat} />
        </div>
        {selectedChat && (
          <div className="w-2/4 p-4 rounded bg-black h-[80vh]">
            <h2 className="text-xl font-bold text-white mb-4 static">{selectedChat.name}</h2>
            <div className="p-4 rounded shadow-md overflow-y-auto max-h-[70vh] h-[70vh] border-1 bg-[#0D0D0E] border-[#867979] flex flex-col justify-between">
              <div className="mb-4">
                {messages.map((msg, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-white flex justify-between">
                      <span><strong>{msg.sender && msg.sender.name}</strong>: {msg.content}{" "}</span>
                      <em>{new Date(msg.timestamp).toLocaleTimeString()}</em>
                    </p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <input
                type="text"
                className="w-full p-2 border rounded bg-[#1D1D1F] text-white"
                placeholder="Escribe tu mensaje..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim() !== "") {
                    sendMessage(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        )}
        <div className="w-1/4">
          <CreateChat></CreateChat>
        </div>
      </section>
    </div>
  );
};

export default Comunidad;
