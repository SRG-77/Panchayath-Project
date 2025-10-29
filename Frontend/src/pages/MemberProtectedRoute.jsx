import React from "react";
import { Navigate } from "react-router-dom";

export default function MemberProtectedRoute({ children }) {
  const token = localStorage.getItem("memberToken");

  if (!token) {
    return <Navigate to="/member-login" replace />;
  }

  return children;
}
