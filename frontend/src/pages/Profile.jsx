import { useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ================= GET PROFILE =================

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/users/profile",
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
            data.message || "Failed to fetch profile"
          );
        }

        // Depending on backend response format
        const profileData = data.user || data;

        setUser(profileData);

        // Update localStorage with latest details
        localStorage.setItem(
          "user",
          JSON.stringify(profileData)
        );
      } catch (error) {
        console.error("Profile API Error:", error);

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <div className="profile-container">
          <h1>MY ACCOUNT</h1>

          {/* LOADING */}

          {loading && (
            <p className="profile-message">
              Loading profile...
            </p>
          )}

          {/* ERROR */}

          {error && (
            <p className="profile-error">
              {error}
            </p>
          )}

          {/* USER INFO */}

          {!loading && !error && (
            <>
              <div className="profile-user">
                <div className="profile-avatar">
                  👤
                </div>

                <div>
                  <h2>{user?.name || "User"}</h2>

                  <p>{user?.email || ""}</p>
                </div>
              </div>

              {/* MENU */}

              <div className="profile-menu">

                {/* PERSONAL INFORMATION */}

                <Link
                  to="/profile/personal"
                  className="profile-item"
                >
                  <div>
                    <h3>Personal Information</h3>

                    <p>Manage your account details</p>
                  </div>
                </Link>

                {/* MY ORDERS */}

                <Link
                  to="/orders"
                  className="profile-item"
                >
                  <div>
                    <h3>My Orders</h3>

                    <p>View your orders</p>
                  </div>
                </Link>

                {/* MY WISHLIST */}

                <Link
                  to="/wishlist"
                  className="profile-item"
                >
                  <div>
                    <h3>My Wishlist</h3>

                    <p>
                      View your favourite products
                    </p>
                  </div>
                </Link>

                {/* MY ADDRESSES */}

                <Link
                  to="/profile/addresses"
                  className="profile-item"
                >
                  <div>
                    <h3>My Addresses</h3>

                    <p>
                      Manage delivery addresses
                    </p>
                  </div>
                </Link>

                {/* CHANGE PASSWORD */}

                <Link
                  to="/profile/change-password"
                  className="profile-item"
                >
                  <div>
                    <h3>Change Password</h3>

                    <p>Update your password</p>
                  </div>
                </Link>
              </div>

              {/* LOGOUT */}

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                LOGOUT
              </button>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Profile;