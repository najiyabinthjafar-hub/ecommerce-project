import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Addresses.css";

function Addresses() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState(() => {
    const savedAddresses = localStorage.getItem("addresses");

    return savedAddresses ? JSON.parse(savedAddresses) : [];
  });

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAddress = {
      id: Date.now(),
      ...formData,
    };

    const updatedAddresses = [
      ...addresses,
      newAddress,
    ];

    setAddresses(updatedAddresses);

    localStorage.setItem(
      "addresses",
      JSON.stringify(updatedAddresses)
    );

    setFormData({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    const updatedAddresses = addresses.filter(
      (address) => address.id !== id
    );

    setAddresses(updatedAddresses);

    localStorage.setItem(
      "addresses",
      JSON.stringify(updatedAddresses)
    );
  };

  return (
    <>
      <Navbar />

      <main className="addresses-page">
        <div className="addresses-container">

          <div className="addresses-header">
            <button
              className="back-btn"
              onClick={() => navigate("/profile")}
            >
              ← BACK
            </button>

            <h1>MY ADDRESSES</h1>

            <button
              className="add-address-btn"
              onClick={() => setShowForm(!showForm)}
            >
              + ADD ADDRESS
            </button>
          </div>

          {/* ADD ADDRESS FORM */}

          {showForm && (
            <form
              className="address-form"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <textarea
                name="address"
                placeholder="Full Address"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              />

              <div className="address-form-buttons">
                <button type="submit">
                  SAVE ADDRESS
                </button>

                <button
                  type="button"
                  className="cancel-address-btn"
                  onClick={() => setShowForm(false)}
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}

          {/* ADDRESS LIST */}

          <div className="addresses-list">

            {addresses.length === 0 ? (
              <div className="no-address">
                <p>No addresses added yet.</p>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  className="address-card"
                  key={address.id}
                >
                  <h3>{address.fullName}</h3>

                  <p>{address.phone}</p>

                  <p>{address.address}</p>

                  <p>
                    {address.city}, {address.state}
                  </p>

                  <p>{address.pincode}</p>

                  <button
                    className="delete-address-btn"
                    onClick={() =>
                      handleDelete(address.id)
                    }
                  >
                    DELETE
                  </button>
                </div>
              ))
            )}

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Addresses;