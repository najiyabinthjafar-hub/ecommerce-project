
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminNotification from "./AdminNotification";
import "./AdminNavbar.css";

function AdminNavbar() {
  const navigate = useNavigate();

  return (
    <header className="admin-navbar">

      {/* Left Side */}
      <div className="navbar-left">
        <h2>Admin Panel</h2>
      </div>

      {/* Right Side */}
      <div className="navbar-right">

        {/* Notifications */}
        <AdminNotification />

        {/* Admin Profile */}
        <div
          className="navbar-profile"
          onClick={() => navigate("/admin/profile")}
          role="button"
          tabIndex={0}
        >
          <div className="navbar-avatar">
            <i className="bi bi-person-fill"></i>
          </div>

          <div className="navbar-profile-info">
            <span className="navbar-name">Admin</span>
            <span className="navbar-role">Super Admin</span>
          </div>

          <i className="bi bi-chevron-down profile-arrow"></i>
        </div>

      </div>

    </header>
  );
}

export default AdminNavbar;

