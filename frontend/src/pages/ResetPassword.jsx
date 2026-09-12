import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Login.css";

function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      setMessage(
        response.data?.message || "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Reset password error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="login-page">
        <section className="login-container">
          <div className="login-header">
            <p className="login-label">RESET PASSWORD</p>

            <h1>RESET PASSWORD</h1>

            <span>
              Enter the OTP sent to your email and create a new password.
            </span>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>

            <div className="login-field">
              <label htmlFor="email">EMAIL ADDRESS</label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="otp">OTP</label>

              <input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                maxLength="6"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="newPassword">NEW PASSWORD</label>

              <input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="confirmPassword">
                CONFIRM PASSWORD
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                required
              />
            </div>

            {message && (
              <p style={{ color: "green", marginTop: "10px" }}>
                {message}
              </p>
            )}

            {error && (
              <p style={{ color: "red", marginTop: "10px" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "RESETTING..." : "RESET PASSWORD"}
            </button>
          </form>

          <div className="login-register">
            <span>Remember your password?</span>

            <Link to="/login">BACK TO LOGIN</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ResetPassword;