import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("Login response:", response.data);

      const { token, user } = response.data;

      // Check token
      if (!token) {
        setError("Login failed: Token not received.");
        return;
      }

      // Save JWT token
      localStorage.setItem("token", token);

      // Save user details
      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        if (user._id || user.id) {
          localStorage.setItem(
            "userId",
            user._id || user.id
          );
        }
      }

      alert("Login successful!");

      // Go to home page and remove login page from history
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <>
      <Navbar />

      <main className="login-page">
        <section className="login-container">

          {/* HEADER */}
          <div className="login-header">
            <p className="login-label">
              WELCOME BACK
            </p>

            <h1>LOGIN</h1>

            <span>
              Sign in to continue shopping with us.
            </span>
          </div>

          {/* ERROR */}
          {error && (
            <p className="login-error-message">
              {error}
            </p>
          )}

          {/* LOGIN FORM */}
          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* EMAIL */}
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
                onChange={(event) => {
                  setEmail(event.target.value);

                  event.target.setCustomValidity("");
                }}
                onInvalid={(event) => {
                  if (!event.target.value.trim()) {
                    event.target.setCustomValidity(
                      "Please enter your email address."
                    );
                  } else {
                    event.target.setCustomValidity(
                      "Please enter a valid email address."
                    );
                  }
                }}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="login-field">
              <label htmlFor="password">
                PASSWORD
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);

                  event.target.setCustomValidity("");
                }}
                onInvalid={(event) => {
                  event.target.setCustomValidity(
                    "Please enter your password."
                  );
                }}
                required
              />
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="login-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="remember"
                />

                <span>
                  Remember me
                </span>
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? "LOGGING IN..."
                : "LOGIN"}
            </button>
          </form>

          {/* REGISTER */}
          <div className="login-register">
            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              CREATE ACCOUNT
            </Link>
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}

export default Login;