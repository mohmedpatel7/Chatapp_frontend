// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const isUser = localStorage.getItem("user-token");
  return isUser ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
