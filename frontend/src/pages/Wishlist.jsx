import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Wishlist.css";

const API_URL = "https://ecommerce-project-aopf.onrender.com/api";

function Wishlist() {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackToProfile = location.state?.fromProfile === true;

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingProduct, setUpdatingProduct] = useState(null);

  // TOKEN
  const getToken = () => localStorage.getItem("token");

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  // FETCH WISHLIST
  const fetchWishlist = async () => {
    const token = getToken();

    if (!token) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/wishlist`,
        getAuthConfig()
      );

      setWishlist(response.data.wishlist?.products || []);
    } catch (error) {
      console.error("GET WISHLIST ERROR:", error);

      setError(
        error.response?.data?.message || "Failed to fetch wishlist"
      );

      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  // FETCH ON PAGE LOAD
  useEffect(() => {
    fetchWishlist();
  }, []);

  // REMOVE FROM WISHLIST
  const removeFromWishlist = async (productId) => {
    if (!getToken()) {
      navigate("/login");
      return;
    }

    try {
      setUpdatingProduct(productId);

      await axios.delete(
        `${API_URL}/wishlist/remove/${productId}`,
        getAuthConfig()
      );

      // Update UI immediately
      setWishlist((prev) =>
        prev.filter(
          (product) =>
            String(product._id || product.id) !== String(productId)
        )
      );

      // Update navbar wishlist count
      window.dispatchEvent(new Event("wishlistUpdated"));

      toast.success("Product removed from wishlist!");
    } catch (error) {
      console.error("REMOVE WISHLIST ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to remove product from wishlist"
      );
    } finally {
      setUpdatingProduct(null);
    }
  };

  // ADD TO CART
  const addToCart = async (product) => {
    const token = getToken();

    if (!token) {
      toast.error("Please login to add products to your cart.");
      navigate("/login");
      return;
    }

    const productId = product._id || product.id;

    try {
      setUpdatingProduct(productId);

      await axios.post(
        `${API_URL}/cart/add`,
        {
          productId,
          quantity: 1,
        },
        getAuthConfig()
      );

      toast.success(`${product.name} added to cart!`);

      // Wishlist-il ninnu product remove cheyyunnilla
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to add product to cart"
      );
    } finally {
      setUpdatingProduct(null);
    }
  };

  // LOGIN CHECK
  if (!getToken()) {
    return (
      <>
        <Navbar />

        <main className="wishlist-page">
          <div className="wishlist-container">
            <section className="wishlist-empty">
              <div className="empty-heart">♡</div>

              <h2>Please Login</h2>

              <p>Login to view and manage your wishlist.</p>

              <Link to="/login">LOGIN</Link>
            </section>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // LOADING
  if (loading) {
    return (
      <>
        <Navbar />

        <main className="wishlist-page">
          <div className="wishlist-container">
            <p className="no-products">Loading wishlist...</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="wishlist-page">
        <div className="wishlist-container">
          {/* BACK TO PROFILE */}
          {showBackToProfile && (
            <button
              type="button"
              className="wishlist-back-btn"
              onClick={() => navigate("/profile")}
            >
              ← BACK TO PROFILE
            </button>
          )}

          {/* ERROR */}
          {error && <p className="no-products">{error}</p>}

          {/* EMPTY WISHLIST */}
          {!error && wishlist.length === 0 && (
            <section className="wishlist-empty">
              <div className="empty-heart">♡</div>

              <h2>Your wishlist is empty</h2>

              <p>
                Save your favourite products here and shop them later.
              </p>

              <Link to="/shop">START SHOPPING</Link>
            </section>
          )}

          {/* WISHLIST PRODUCTS */}
          {!error && wishlist.length > 0 && (
            <section className="wishlist-products">
              {wishlist.map((product) => {
                const productId = product._id || product.id;

                const productImage =
                  product.images?.[0] ||
                  product.image ||
                  "https://via.placeholder.com/300";

                const productPrice =
                  product.salePrice !== null &&
                  product.salePrice !== undefined &&
                  product.salePrice !== ""
                    ? product.salePrice
                    : product.regularPrice || product.price || 0;

                const isUpdating =
                  String(updatingProduct) === String(productId);

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
                        alt={product.name || "Product"}
                      />
                    </Link>

                    {/* PRODUCT INFO */}
                    <div className="wishlist-info">
                      <h3>{product.name}</h3>

                      <p>
                        ₹{" "}
                        {Number(productPrice).toLocaleString("en-IN")}
                        /-
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="wishlist-actions">
                      <button
                        type="button"
                        className="wishlist-cart-btn"
                        onClick={() => addToCart(product)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "PLEASE WAIT..." : "ADD TO CART"}
                      </button>

                      <button
                        type="button"
                        className="wishlist-remove-btn"
                        onClick={() => removeFromWishlist(productId)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "PLEASE WAIT..." : "REMOVE"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Wishlist;
