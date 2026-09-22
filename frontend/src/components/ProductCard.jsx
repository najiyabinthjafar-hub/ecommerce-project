import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./ProductCard.css";

const API_URL = "http://localhost:5000/api";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const [wishlistIds, setWishlistIds] = useState([]);
  const [updatingWishlist, setUpdatingWishlist] = useState(false);

  // ================= PRODUCT ID =================

  const productId = product._id || product.id;

  // ================= TOKEN =================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getAuthConfig = () => {
    return {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
  };

  // ================= FETCH WISHLIST =================

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = getToken();

      if (!token) {
        setWishlistIds([]);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/wishlist`,
          getAuthConfig()
        );

        console.log("WISHLIST RESPONSE:", response.data);

        const products =
          response.data.wishlist?.products || [];

        const ids = products.map((item) =>
          String(item._id || item.id || item)
        );

        setWishlistIds(ids);
      } catch (error) {
        console.error(
          "FETCH WISHLIST ERROR:",
          error.response?.data || error.message
        );

        setWishlistIds([]);
      }
    };

    fetchWishlist();
  }, []);

  // ================= PRODUCT IMAGE =================

  let productImage =
    product.images?.[0] ||
    product.image ||
    "";

  if (
    productImage &&
    !productImage.startsWith("http") &&
    !productImage.startsWith("data:")
  ) {
    productImage = `http://localhost:5000${
      productImage.startsWith("/") ? "" : "/"
    }${productImage}`;
  }

  if (!productImage) {
    productImage =
      "https://via.placeholder.com/500x600?text=No+Image";
  }

  // ================= PRICE =================

  const productPrice =
    product.salePrice !== null &&
    product.salePrice !== undefined &&
    product.salePrice !== ""
      ? product.salePrice
      : product.regularPrice ??
        product.price ??
        0;

  // ================= WISHLIST CHECK =================

  const isWishlisted = wishlistIds.includes(
    String(productId)
  );

  // ================= WISHLIST =================

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getToken();

    if (!token) {
      alert(
        "Please login to add products to your wishlist."
      );

      navigate("/login");

      return;
    }

    try {
      setUpdatingWishlist(true);

      if (isWishlisted) {
        // ================= REMOVE =================

        const response = await axios.delete(
          `${API_URL}/wishlist/remove/${productId}`,
          getAuthConfig()
        );

        console.log(
          "REMOVE WISHLIST RESPONSE:",
          response.data
        );

        setWishlistIds((prev) =>
          prev.filter(
            (id) => id !== String(productId)
          )
        );
      } else {
        // ================= ADD =================

        const response = await axios.post(
          `${API_URL}/wishlist/add`,
          {
            productId: productId,
          },
          getAuthConfig()
        );

        console.log(
          "ADD WISHLIST RESPONSE:",
          response.data
        );

        setWishlistIds((prev) => [
          ...prev,
          String(productId),
        ]);
      }
    } catch (error) {
      console.error(
        "WISHLIST ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update wishlist"
      );
    } finally {
      setUpdatingWishlist(false);
    }
  };

  // ================= IMAGE ERROR =================

  const handleImageError = (e) => {
    e.currentTarget.src =
      "https://via.placeholder.com/500x600?text=No+Image";
  };

  return (
    <div className="product-card">

      {/* WISHLIST BUTTON */}

      <button
        type="button"
        className={`wishlist-btn ${
          isWishlisted ? "active-wishlist" : ""
        }`}
        onClick={handleWishlist}
        disabled={updatingWishlist}
        aria-label={
          isWishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
      >
        {isWishlisted ? "♥" : "♡"}
      </button>

      {/* PRODUCT LINK */}

      <Link
        to={`/product/${productId}`}
        className="product-link"
      >
        <div className="product-image-wrapper">
          <img
            src={productImage}
            alt={product.name || "Product"}
            className="product-image"
            onError={handleImageError}
          />
        </div>

        <div className="product-info">
          <h3>
            {product.name || "Product Name"}
          </h3>

          <p className="product-price">
            ₹{" "}
            {Number(productPrice).toLocaleString(
              "en-IN"
            )}
            /-
          </p>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;