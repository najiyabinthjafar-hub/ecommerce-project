import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Addresses.css";

function Addresses() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // null = Add mode
  // address object = Edit mode
  const [editingAddress, setEditingAddress] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
  });

  // ================= GET ADDRESSES =================

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/addresses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch addresses"
          );
        }

        setAddresses(data.addresses || data);
      } catch (error) {
        console.error("Address fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [navigate]);

  // ================= HANDLE INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numbersOnly = value.replace(/\D/g, "");

      if (numbersOnly.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          phone: numbersOnly,
        }));
      }

      return;
    }

    if (name === "postalCode") {
      const numbersOnly = value.replace(/\D/g, "");

      if (numbersOnly.length <= 6) {
        setFormData((prev) => ({
          ...prev,
          postalCode: numbersOnly,
        }));
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= ADD ADDRESS BUTTON =================

  const handleAddAddress = () => {
    setEditingAddress(null);

    setFormData({
      fullName: "",
      phone: "",
      addressLine1: "",
      city: "",
      state: "",
      postalCode: "",
    });

    setError("");
    setShowForm(true);
  };

  // ================= EDIT ADDRESS =================

  const handleEdit = (address) => {
    setEditingAddress(address);

    setFormData({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine1: address.addressLine1 || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
    });

    setError("");
    setShowForm(true);

    // Form visible ആയ സ്ഥലത്തേക്ക് പോകാൻ
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= ADD / UPDATE ADDRESS =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setError("");

    // Validation
    if (formData.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    if (formData.postalCode.length !== 6) {
      setError("Postal code must be exactly 6 digits.");
      return;
    }

    try {
      setSaving(true);

      let url = "http://localhost:5000/api/addresses";
      let method = "POST";

      // EDIT MODE
      if (editingAddress) {
        url = `http://localhost:5000/api/addresses/${editingAddress._id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${
              editingAddress ? "update" : "add"
            } address`
        );
      }

      const savedAddress = data.address || data;

      // ================= UPDATE STATE =================

      if (editingAddress) {
        setAddresses((prev) =>
          prev.map((address) =>
            address._id === editingAddress._id
              ? savedAddress
              : address
          )
        );
      } else {
        setAddresses((prev) => [
          ...prev,
          savedAddress,
        ]);
      }

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        postalCode: "",
      });

      setEditingAddress(null);
      setShowForm(false);
    } catch (error) {
      console.error("Address save error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE ADDRESS =================

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) return;

    try {
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/addresses/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete address"
        );
      }

      setAddresses((prev) =>
        prev.filter((address) => address._id !== id)
      );
    } catch (error) {
      console.error("Delete address error:", error);
      setError(error.message);
    }
  };

  // ================= CANCEL FORM =================

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    setError("");

    setFormData({
      fullName: "",
      phone: "",
      addressLine1: "",
      city: "",
      state: "",
      postalCode: "",
    });
  };

  return (
    <>
      <Navbar />

      <main className="addresses-page">
        <div className="addresses-container">

          <div className="addresses-header">
            <h1>MY ADDRESSES</h1>

            <button
              className="add-address-btn"
              onClick={
                showForm
                  ? handleCancel
                  : handleAddAddress
              }
            >
              {showForm
                ? "CLOSE"
                : "+ ADD ADDRESS"}
            </button>
          </div>

          {/* ERROR */}

          {error && (
            <p className="address-error-message">
              {error}
            </p>
          )}

          {/* ADD / EDIT FORM */}

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
                maxLength="10"
                required
              />

              <textarea
                name="addressLine1"
                placeholder="Full Address"
                value={formData.addressLine1}
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
                name="postalCode"
                placeholder="Pincode"
                value={formData.postalCode}
                onChange={handleChange}
                maxLength="6"
                required
              />

              <div className="address-form-buttons">
                <button
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : editingAddress
                    ? "UPDATE ADDRESS"
                    : "SAVE ADDRESS"}
                </button>

                <button
                  type="button"
                  className="cancel-address-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}

          {/* LOADING */}

          {loading && (
            <div className="no-address">
              <p>Loading addresses...</p>
            </div>
          )}

          {/* ADDRESS LIST */}

          {!loading && (
            <div className="addresses-list">
              {addresses.length === 0 ? (
                <div className="no-address">
                  <p>No addresses added yet.</p>
                </div>
              ) : (
                addresses.map((address) => (
                  <div
                    className="address-card"
                    key={address._id}
                  >
                    <h3>{address.fullName}</h3>

                    <p>{address.phone}</p>

                    <p>
                      {address.addressLine1}
                    </p>

                    <p>
                      {address.city},{" "}
                      {address.state}
                    </p>

                    <p>
                      {address.postalCode}
                    </p>

                    {/* ACTION BUTTONS */}

                    <div className="address-actions">
                      <button
                        className="edit-address-btn"
                        onClick={() =>
                          handleEdit(address)
                        }
                      >
                        EDIT
                      </button>

                      <button
                        className="delete-address-btn"
                        onClick={() =>
                          handleDelete(address._id)
                        }
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Addresses;