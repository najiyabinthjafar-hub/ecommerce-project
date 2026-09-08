import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./ChangePassword.css";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // പുതിയ password രണ്ടും same ആണോ എന്ന് പരിശോധിക്കുന്നു
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match!");
      return;
    }

    // Password empty ആകരുത്
    if (newPassword.length < 6) {
      setError("Password must contain at least 6 characters!");
      return;
    }

    // ഇപ്പോൾ frontend demo success
    setMessage("Password changed successfully!");

    // Form clear
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    // പിന്നീട് backend API connect ചെയ്യാം
  };

  return (
    <>
      <Navbar />

      <main className="change-password-page">
        <div className="change-password-container">

          <button
            className="password-back-btn"
            onClick={() => navigate("/profile")}
          >
            ← BACK TO PROFILE
          </button>

          <h1>CHANGE PASSWORD</h1>

          <p className="password-description">
            Update your password to keep your account secure.
          </p>

          {error && (
            <p className="password-error">
              {error}
            </p>
          )}

          {message && (
            <p className="password-success">
              {message}
            </p>
          )}

          <form
            className="change-password-form"
            onSubmit={handleSubmit}
          >

            <div className="password-field">
              <label>CURRENT PASSWORD</label>

              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                required
              />
            </div>

            <div className="password-field">
              <label>NEW PASSWORD</label>

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                required
              />
            </div>

            <div className="password-field">
              <label>CONFIRM NEW PASSWORD</label>

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="update-password-btn"
            >
              UPDATE PASSWORD
            </button>

          </form>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default ChangePassword;