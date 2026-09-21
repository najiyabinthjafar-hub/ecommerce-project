import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Remove custom browser validation message
    event.target.setCustomValidity("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");

    // Password check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // Combine first name + last name
      const fullName = `${formData.firstName} ${formData.lastName}`;

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      // Save email for OTP verification
      localStorage.setItem(
        "registerEmail",
        formData.email
      );

      // Go to OTP page
      navigate("/verify-otp", { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="register-page">
        <section className="register-container">

          <div className="register-header">
            <p className="register-label">
              CREATE YOUR ACCOUNT
            </p>

            <h1>REGISTER</h1>

            <span>
              Create an account and start your shopping journey.
            </span>
          </div>

          {error && (
            <p className="register-error-message">
              {error}
            </p>
          )}

          <form
            className="register-form"
            onSubmit={handleRegister}
          >

            {/* FIRST NAME + LAST NAME */}
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
                  value={formData.firstName}
                  onChange={handleChange}
                  onInvalid={(event) => {
                    event.target.setCustomValidity(
                      "Please enter your first name."
                    );
                  }}
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
                  value={formData.lastName}
                  onChange={handleChange}
                  onInvalid={(event) => {
                    event.target.setCustomValidity(
                      "Please enter your last name."
                    );
                  }}
                  required
                />
              </div>

            </div>

            {/* EMAIL */}
            <div className="register-field">
              <label htmlFor="email">
                EMAIL ADDRESS
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
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

            {/* PHONE */}
            <div className="register-field">
              <label htmlFor="phone">
                PHONE NUMBER
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                onInvalid={(event) => {
                  event.target.setCustomValidity(
                    "Please enter your phone number."
                  );
                }}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="register-field">
              <label htmlFor="password">
                PASSWORD
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                onInvalid={(event) => {
                  event.target.setCustomValidity(
                    "Please enter your password."
                  );
                }}
                required
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="register-field">
              <label htmlFor="confirmPassword">
                CONFIRM PASSWORD
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onInvalid={(event) => {
                  event.target.setCustomValidity(
                    "Please confirm your password."
                  );
                }}
                required
              />
            </div>

            {/* TERMS */}
            <label className="terms-checkbox">
              <input
                type="checkbox"
                required
                onInvalid={(event) => {
                  event.target.setCustomValidity(
                    "Please accept the terms and conditions."
                  );
                }}
                onChange={(event) => {
                  event.target.setCustomValidity("");
                }}
              />

              <span>
                I agree to the terms and conditions.
              </span>
            </label>

            {/* BUTTON */}
            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              {loading
                ? "CREATING ACCOUNT..."
                : "CREATE ACCOUNT"}
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