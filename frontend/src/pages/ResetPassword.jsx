import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    localStorage.getItem("forgotPasswordEmail") || ""
  );
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email || !otp || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to reset password"
        );
      }

      setMessage(
        data.message || "Password reset successfully!"
      );

      localStorage.removeItem("forgotPasswordEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="reset-password-page">
        <section className="reset-password-container">

          <div className="reset-password-header">
            <p>ACCOUNT SECURITY</p>

            <h1>RESET PASSWORD</h1>

            <span>
              Enter the OTP sent to your email and create a new password.
            </span>
          </div>

          {message && (
            <p className="reset-success-message">
              {message}
            </p>
          )}

          {error && (
            <p className="reset-error-message">
              {error}
            </p>
          )}

          <form
            className="reset-password-form"
            onSubmit={handleResetPassword}
          >

            <div className="reset-password-field">
              <label htmlFor="email">
                EMAIL ADDRESS
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="reset-password-field">
              <label htmlFor="otp">
                OTP
              </label>

              <input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div className="reset-password-field">
              <label htmlFor="newPassword">
                NEW PASSWORD
              </label>

              <input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="reset-password-field">
              <label htmlFor="confirmPassword">
                CONFIRM PASSWORD
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="reset-password-btn"
              disabled={loading}
            >
              {loading
                ? "RESETTING..."
                : "RESET PASSWORD"}
            </button>

          </form>

          <div className="reset-back-login">
            <Link to="/login">
              BACK TO LOGIN
            </Link>
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}

export default ResetPassword;