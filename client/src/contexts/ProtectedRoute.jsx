import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();

  if (user === null) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;