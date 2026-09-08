import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./VerifyOtp.css";

function VerifyOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 1 minute = 60 seconds
  const [timeLeft, setTimeLeft] = useState(60);

  const email = localStorage.getItem("registerEmail");

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Convert seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    if (timeLeft <= 0) {
      setError("OTP expired. Please resend OTP.");
      return;
    }

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      setMessage(data.message);

      localStorage.removeItem("registerEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/resend-otp",
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
        throw new Error(data.message || "Failed to resend OTP");
      }

      setMessage(data.message);

      // Restart timer to 1 minute
      setTimeLeft(60);

      // Clear old OTP
      setOtp("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="verify-otp-page">
        <section className="verify-otp-container">

          <div className="verify-otp-header">
            <p>EMAIL VERIFICATION</p>

            <h1>VERIFY OTP</h1>

            <span>
              We have sent a verification code to your email address.
            </span>
          </div>

          {email && (
            <p className="otp-email">{email}</p>
          )}

          {/* TIMER */}
          <div className="otp-timer">
            {timeLeft > 0 ? (
              <>
                OTP expires in:{" "}
                <strong>{formatTime(timeLeft)}</strong>
              </>
            ) : (
              <strong>OTP EXPIRED</strong>
            )}
          </div>

          {message && (
            <p className="otp-success-message">
              {message}
            </p>
          )}

          {error && (
            <p className="otp-error-message">
              {error}
            </p>
          )}

          <form
            className="verify-otp-form"
            onSubmit={handleVerifyOtp}
          >
            <div className="verify-otp-field">
              <label htmlFor="otp">
                ENTER OTP
              </label>

              <input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={timeLeft <= 0}
                required
              />
            </div>

            <button
              type="submit"
              className="verify-otp-btn"
              disabled={loading || timeLeft <= 0}
            >
              {loading
                ? "VERIFYING..."
                : timeLeft <= 0
                ? "OTP EXPIRED"
                : "VERIFY OTP"}
            </button>
          </form>

          <div className="resend-otp">
            <span>
              Didn't receive the OTP?
            </span>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
            >
              {loading
                ? "SENDING..."
                : "RESEND OTP"}
            </button>
          </div>

          <div className="back-login">
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

export default VerifyOtp;