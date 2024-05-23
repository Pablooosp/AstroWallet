import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Dashboard from "./pages/Dashboard";
import Transacciones from "./pages/Transacciones";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./contexts/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/transacciones" element={<ProtectedRoute element={<Transacciones />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
