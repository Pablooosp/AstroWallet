import React, { useState, useEffect } from "react";
import Delete from "../assets/delete.svg";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userEmail = user ? user.email : null;

        if (!userEmail) {
          setIsLoading(false);
          return;
        }

        setUserEmail(userEmail);

        const response = await fetch(
          `http://localhost:3000/api/users/${userEmail}/friends`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleAddFriend = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userEmail}/friends`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friendEmail }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMessage(data.message);
      if (data.email) {
        setFriends([...friends, data]);
        setFriendEmail("");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      setMessage("Error al añadir amigo");
    }
  };

  const handleRemoveFriend = async (friendEmailToRemove) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userEmail}/friends/${friendEmailToRemove}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setFriends(
        friends.filter((friend) => friend.email !== friendEmailToRemove)
      );
      setMessage("Amigo eliminado");
    } catch (error) {
      console.error("Error removing friend:", error);
      setMessage("Error eliminando amigo");
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex">
        <input
          type="email"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          placeholder="Correo electrónico del amigo"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleAddFriend}
          className="bg-blue-500 text-white p-1 px-3 rounded"
        >
          +
        </button>
      </div>
      {message && <p className="text-green-500">{message}</p>}
      <h3 className="text-lg font-bold mt-4">Lista de Amigos</h3>
      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <ul className="list-disc list-inside">
          {friends.map((friend, index) => (
            <li key={index} className="flex justify-between items-center m-1">
              <span>{friend.email}</span>
              <button
                onClick={() => handleRemoveFriend(friend.email)}
                className="bg-gray-500 text-white px-2 py-1 rounded"
              >
                <img src={Delete} alt="" width="20" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Friends;
