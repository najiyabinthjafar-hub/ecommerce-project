
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const handleRegister = (event) => {
    event.preventDefault();

    // Backend API later connect cheyyam
    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <main className="register-page">

        <section className="register-container">

          <div className="register-header">
            <p className="register-label">CREATE YOUR ACCOUNT</p>

            <h1>REGISTER</h1>

            <span>
              Create an account and start your shopping journey.
            </span>
          </div>

          <form
            className="register-form"
            onSubmit={handleRegister}
          >

            <div className="register-row">

              <div className="register-field">
                <label htmlFor="firstName">
                  FIRST NAME
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="lastName">
                  LAST NAME
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  required
                />
              </div>

            </div>

            <div className="register-field">
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

            <div className="register-field">
              <label htmlFor="phone">
                PHONE NUMBER
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="password">
                PASSWORD
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="confirmPassword">
                CONFIRM PASSWORD
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
              />
            </div>

            <label className="terms-checkbox">
              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the terms and conditions.
              </span>
            </label>

            <button
              type="submit"
              className="register-btn"
            >
              CREATE ACCOUNT
            </button>

          </form>

          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              LOGIN
            </Link>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Register;

