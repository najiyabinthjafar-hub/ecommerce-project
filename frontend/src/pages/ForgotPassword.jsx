import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to send reset OTP"
        );
      }

      setMessage(
        data.message || "OTP sent to your email."
      );

      // Save email for Reset Password page
      localStorage.setItem("forgotPasswordEmail", email);

      setTimeout(() => {
        navigate("/reset-password");
      }, 1200);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="forgot-password-page">
        <section className="forgot-password-container">
          <div className="forgot-password-header">
            <p>PASSWORD RECOVERY</p>

            <h1>FORGOT PASSWORD?</h1>

            <span>
              Enter your email address and we will send you
              an OTP to reset your password.
            </span>
          </div>

          {message && (
            <p className="forgot-success-message">
              {message}
            </p>
          )}

          {error && (
            <p className="forgot-error-message">
              {error}
            </p>
          )}

          <form
            className="forgot-password-form"
            onSubmit={handleForgotPassword}
          >
            <div className="forgot-password-field">
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

            <button
              type="submit"
              className="forgot-password-btn"
              disabled={loading}
            >
              {loading
                ? "SENDING..."
                : "SEND RESET OTP"}
            </button>
          </form>

          <div className="forgot-back-login">
            <Link to="/login">
              ← BACK TO LOGIN
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ForgotPassword;