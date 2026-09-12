import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProfile.css";

function AdminProfile() {
  const navigate = useNavigate();

  return (
    <div className="admin-profile-page">

      {/* Back Button */}
      <button
        className="profile-back-btn"
        onClick={() => navigate("/admin/dashboard")}
      >
        <i className="bi bi-arrow-left"></i>
        Back to Dashboard
      </button>

      {/* Page Header */}
      <div className="profile-header">
        <div>
          <h1>Admin Profile</h1>
          <p>Manage your account and security settings</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">

        <div className="profile-avatar">
          <i className="bi bi-person-fill"></i>
        </div>

        <div className="profile-details">
          <h2>Admin</h2>

          <div className="profile-info">
            <div>
              <span>Name</span>
              <strong>Admin</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>admin@rizo.com</strong>
            </div>

            <div>
              <span>Role</span>
              <strong>Super Admin</strong>
            </div>
          </div>
        </div>

        <button className="edit-profile-btn">
          <i className="bi bi-pencil"></i>
          Edit Profile
        </button>

      </div>

      {/* Security Section */}
      <div className="security-card">

        <div className="security-header">
          <div className="security-icon">
            <i className="bi bi-shield-lock"></i>
          </div>

          <div>
            <h2>Security Settings</h2>
            <p>Keep your account secure</p>
          </div>
        </div>

        <button className="change-password-btn">
          <i className="bi bi-key"></i>
          Change Password
        </button>

      </div>

      {/* Save Changes */}
      <div className="profile-actions">
        <button className="save-profile-btn">
          Save Changes
        </button>
      </div>

    </div>
  );
}

export default AdminProfile;