import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminNotFound.css";

function AdminNotFound() {
  const navigate = useNavigate();

  return (
    <div className="admin-not-found-page">
      <div className="admin-not-found-card">
        <div className="admin-404-number">404</div>

        <h1>Page Not Found</h1>

        <p>
          The admin page you're looking for doesn't exist or may have been
          moved.
        </p>

        <button
          type="button"
          className="admin-404-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          <i className="bi bi-arrow-left"></i>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default AdminNotFound;