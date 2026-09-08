import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

import "./PersonalInformation.css";

function PersonalInformation() {

  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(storedUser?.name || "");

  const [email, setEmail] = useState(storedUser?.email || "");

  const [phone, setPhone] = useState(storedUser?.phone || "");

  const [error, setError] = useState("");

  const handlePhoneChange = (e) => {

    // നമ്പറുകൾ മാത്രം അനുവദിക്കും
    const value = e.target.value.replace(/\D/g, "");

    // Maximum 10 digits
    if (value.length <= 10) {
      setPhone(value);
    }

    setError("");
  };

  const handleSave = (e) => {

    e.preventDefault();

    setError("");

    // Phone number നൽകിയിട്ടുണ്ടെങ്കിൽ അത് 10 digit ആയിരിക്കണം
    if (phone && phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    const updatedUser = {

      ...storedUser,

      name,

      email,

      phone,

    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Profile updated successfully!");

    navigate("/profile");

  };

  return (

    <>

      <Navbar />

      <main className="personal-page">

        <div className="personal-container">

          <h1>PERSONAL INFORMATION</h1>

          <form
            className="personal-form"
            onSubmit={handleSave}
          >

            <div className="personal-field">

              <label>FULL NAME</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />

            </div>

            <div className="personal-field">

              <label>EMAIL ADDRESS</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />

            </div>

            <div className="personal-field">

              <label>PHONE NUMBER</label>

              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter your 10 digit phone number"
                maxLength="10"
              />

              {error && (
                <p className="phone-error">
                  {error}
                </p>
              )}

            </div>

            <div className="personal-buttons">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/profile")}
              >
                CANCEL
              </button>

              <button
                type="submit"
                className="save-profile-btn"
              >
                SAVE CHANGES
              </button>

            </div>

          </form>

        </div>

      </main>

      <Footer />

    </>

  );

}

export default PersonalInformation;