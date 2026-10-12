import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("adminToken");
  const user = JSON.parse(
    localStorage.getItem("adminUser") || "null"
  );

  if (!token || !user || user.role !== "admin") {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;