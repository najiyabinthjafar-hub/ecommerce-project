import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Wishlist.css";

const API_URL = "http://localhost:5000/api";

function Wishlist() {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackToProfile = location.state?.fromProfile === true;

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= GET WISHLIST =================

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setWishlist([]);
        return;
      }

      const response = await axios.get(
        `${API_URL}/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlist(response.data.wishlist?.products || []);
    } catch (error) {
      console.error("Wishlist fetch error:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ================= REMOVE FROM WISHLIST =================

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/wishlist/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlist((currentWishlist) =>
        currentWishlist.filter((product) => {
          const id = product._id || product.id;
          return id !== productId;
        })
      );

      alert("Product removed from wishlist!");
    } catch (error) {
      console.error("Remove wishlist error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to remove product from wishlist."
      );
    }
  };

  // ================= ADD TO CART =================

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      const productId = product._id || product.id;

      await axios.post(
        `${API_URL}/cart/add`,
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Cart Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add product to cart."
      );
    }
  };

  // ================= CLEAR WISHLIST =================

  const clearWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/wishlist/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist([]);

      alert("Wishlist cleared!");
    } catch (error) {
      console.error("Clear wishlist error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to clear wishlist."
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="wishlist-page">
        <div className="wishlist-container">

          {/* BACK TO PROFILE */}

          {showBackToProfile && (
            <button
              className="wishlist-back-btn"
              onClick={() => navigate("/profile")}
            >
              â† BACK TO PROFILE
            </button>
          )}

          {/* HEADING */}

          <section className="wishlist-heading">
            <h1>MY WISHLIST</h1>

            <span>
              Your favourite products in one place.
            </span>
          </section>

          {/* LOADING */}

          {loading ? (
            <section className="wishlist-empty">
              <h2>Loading wishlist...</h2>
            </section>
          ) : wishlist.length === 0 ? (
            /* EMPTY WISHLIST */

            <section className="wishlist-empty">

              <div className="empty-heart">â™¡</div>

              <h2>Your wishlist is empty</h2>

              <p>
                Save your favourite products here and
                shop them later.
              </p>

              <Link to="/shop">
                START SHOPPING
              </Link>

            </section>
          ) : (

            /* WISHLIST PRODUCTS */

            <section className="wishlist-products">

              {wishlist.map((product) => {
                const productId =
                  product._id || product.id;

                const productImage =
                  product.images?.[0] ||
                  product.image ||
                  "https://via.placeholder.com/300";

                const productPrice =
                  product.salePrice !== null &&
                  product.salePrice !== undefined
                    ? product.salePrice
                    : product.regularPrice ||
                      product.price ||
                      0;

                return (
                  <article
                    className="wishlist-card"
                    key={productId}
                  >

                    {/* PRODUCT IMAGE */}

                    <Link
                      to={`/product/${productId}`}
                      className="wishlist-image"
                    >
                      <img
                        src={productImage}
                        alt={product.name}
                      />
                    </Link>

                    {/* PRODUCT INFO */}

                    <div className="wishlist-info">

                      <h3>{product.name}</h3>

                      <p>
                        â‚¹{" "}
                        {Number(productPrice).toLocaleString(
                          "en-IN"
                        )}
                        /-
                      </p>

                    </div>

                    {/* ACTIONS */}

                    <div className="wishlist-actions">

                      <button
                        className="wishlist-cart-btn"
                        onClick={() =>
                          addToCart(product)
                        }
                      >
                        ADD TO CART
                      </button>

                      <button
                        className="wishlist-remove-btn"
                        onClick={() =>
                          removeFromWishlist(productId)
                        }
                      >
                        REMOVE
                      </button>

                    </div>

                  </article>
                );
              })}

              {/* CLEAR WISHLIST */}

              <button
                className="wishlist-remove-btn"
                onClick={clearWishlist}
              >
                CLEAR WISHLIST
              </button>

            </section>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Wishlist;
