import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email,
        }
      );

      setMessage(
        response.data?.message ||
          "Password reset link sent successfully."
      );
    } catch (error) {
      console.error("Forgot password error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to process forgot password request."
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
            <p className="login-label">
              RESET PASSWORD
            </p>

            <h1>
              FORGOT PASSWORD
            </h1>

            <span>
              Enter your email address to reset your password.
            </span>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="login-field">
              <label htmlFor="email">
                EMAIL ADDRESS
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            {message && (
              <p
                style={{
                  color: "green",
                  marginTop: "10px",
                }}
              >
                {message}
              </p>
            )}

            {error && (
              <p
                style={{
                  color: "red",
                  marginTop: "10px",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? "SENDING..."
                : "SEND RESET LINK"}
            </button>
          </form>

          <div className="login-register">
            <span>
              Remember your password?
            </span>

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

export default ForgotPassword;