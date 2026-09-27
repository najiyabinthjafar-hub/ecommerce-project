import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Addresses.css";

function Addresses() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchAddresses();
  }, [token, navigate]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/addresses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAddress = () => {
    setEditingId(null);

    setFormData({
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
    });

    setShowForm(true);
  };

  const handleEdit = (address) => {
    setEditingId(address._id);

    setFormData({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine: address.addressLine || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
    });

    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `http://localhost:5000/api/addresses/${editingId}`
        : "http://localhost:5000/api/addresses";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        fetchAddresses();
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/addresses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="addresses-page">
        <div className="addresses-container">

          <div className="addresses-header">
            <h1>MY ADDRESSES</h1>

            <button
              type="button"
              className="add-address-btn"
              onClick={handleAddAddress}
            >
              + ADD ADDRESS
            </button>
          </div>

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
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="addressLine"
                placeholder="Address"
                value={formData.addressLine}
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

              <div className="form-actions">
                <button
                  type="submit"
                  className="save-address-btn"
                >
                  {editingId ? "UPDATE" : "SAVE"}
                </button>

                <button
                  type="button"
                  className="cancel-address-btn"
                  onClick={handleCancel}
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}

          {!showForm && addresses.length > 0 && (
            <div className="addresses-list">
              {addresses.map((address) => (
                <div
                  className="address-wrapper"
                  key={address._id}
                >
                  <div className="address-card">

                    <h3>{address.fullName}</h3>

                    <p>{address.phone}</p>

                    <p>{address.addressLine}</p>

                    <p>
                      {address.city}, {address.state} -{" "}
                      {address.pincode}
                    </p>

                    <div className="address-actions">

                      <button
                        type="button"
                        className="edit-address-btn"
                        onClick={() => handleEdit(address)}
                      >
                        EDIT
                      </button>

                      <button
                        type="button"
                        className="delete-address-btn"
                        onClick={() =>
                          handleDelete(address._id)
                        }
                      >
                        DELETE
                      </button>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

          {!showForm && addresses.length === 0 && (
            <div className="no-address">
              <p>No addresses added yet.</p>
            </div>
          )}

        </div>

        {/* BACK BUTTON IS OUTSIDE THE BIG GLASS CARD */}
        {!showForm && addresses.length > 0 && (
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← BACK
          </button>
        )}

      </div>

      <Footer />
    </>
  );
}

export default Addresses;