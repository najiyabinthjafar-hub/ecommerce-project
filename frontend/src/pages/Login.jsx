import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
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
        alert("Login failed: Token not received.");
        return;
      }

      // Save JWT token
      localStorage.setItem("token", token);

      // Save user details
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));

        if (user._id) {
          localStorage.setItem("userId", user._id);
        }
      }

      alert("Login successful!");

      // Go to home page
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.message ||
        "Login failed. Please check your email and password.";

      alert(message);
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

          {/* Header */}
          <div className="login-header">
            <p className="login-label">
              WELCOME BACK
            </p>

            <h1>
              LOGIN
            </h1>

            <span>
              Sign in to continue shopping with us.
            </span>
          </div>

          {/* Login Form */}
          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* Email */}
            <div className="login-field">
              <label htmlFor="email">
                EMAIL ADDRESS
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <label htmlFor="password">
                PASSWORD
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Remember Me + Forgot Password */}
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

            {/* Login Button */}
            <button
              type="submit"
              className="login-btn"
            >
              LOGIN
            </button>

          </form>

          {/* Register */}
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