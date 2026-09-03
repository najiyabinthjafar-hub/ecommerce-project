
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    // Backend API later connect cheyyam
    navigate("/");
  };

  return (
    <>
      <Navbar />

      <main className="login-page">

        <section className="login-container">

          <div className="login-header">
            <p className="login-label">WELCOME BACK</p>

            <h1>LOGIN</h1>

            <span>
              Sign in to continue shopping with us.
            </span>
          </div>

          <form
            className="login-form"
            onSubmit={handleLogin}
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
                required
              />
            </div>

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

            <div className="login-options">

              <label className="remember-me">
                <input
                  type="checkbox"
                  name="remember"
                />

                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot password?
              </button>

            </div>

            <button
              type="submit"
              className="login-btn"
            >
              LOGIN
            </button>

          </form>

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

