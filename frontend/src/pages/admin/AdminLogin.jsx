import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/rizo-logo.png";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Basic admin login testing
    if (email === "admin@test.com" && password === "Admin@123") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: "admin@test.com",
          role: "admin",
        })
      );

      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin email or password");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        {/* Logo */}
        <div className="login-brand">
          <img
            src={logo}
            alt="RIZO Logo"
            className="rizo-logo"
          />

          <h1>RIZO</h1>
          <p>Admin Panel</p>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h2>Welcome Back</h2>
          <p>Login to manage your store</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>

          <div className="login-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          {/* Options */}
          <div className="login-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <span className="forgot-password">
              Forgot Password?
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="admin-login-btn"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default AdminLogin;