import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@nextui-org/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido {user.name}</p>
      <p>Email: {user.email}</p>
      <Button color="danger" variant="bordered" onClick={handleLogout}>Cerrar sesion</Button>
    </div>
  );
};

export default Dashboard;
