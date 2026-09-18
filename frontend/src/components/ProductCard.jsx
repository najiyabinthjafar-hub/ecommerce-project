import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./ProductCard.css";

const API_URL = "http://localhost:5000/api";

function ProductCard({ product }) {
  const productId = product._id || product.id;

  const [isWishlisted, setIsWishlisted] = useState(false);

  const productImage =
    product.images?.[0] ||
    product.image ||
    "https://via.placeholder.com/300";

  const productPrice =
    product.salePrice !== null &&
    product.salePrice !== undefined
      ? product.salePrice
      : product.regularPrice || product.price;

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      if (isWishlisted) {
        await axios.delete(
          `${API_URL}/wishlist/remove/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsWishlisted(false);
        alert("Product removed from wishlist");
      } else {
        await axios.post(
          `${API_URL}/wishlist/add`,
          { productId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsWishlisted(true);
        alert("Product added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist error:", error);

      alert(
        error.response?.data?.message ||
          "Wishlist operation failed"
      );
    }
  };

  return (
    <div className="product-card">

      <button
        className={`wishlist-btn ${
          isWishlisted ? "active-wishlist" : ""
        }`}
        onClick={handleWishlist}
        aria-label="Add to wishlist"
      >
        {isWishlisted ? "♥" : "♡"}
      </button>

      <Link to={`/product/${productId}`}>

        <div className="product-image-wrapper">
          <img
            src={productImage}
            alt={product.name}
            className="product-image"
          />
        </div>

        <div className="product-info">
          <h3>{product.name}</h3>

          <p className="product-price">
            ₹ {Number(productPrice || 0).toLocaleString("en-IN")}/-
          </p>
        </div>

      </Link>
    </div>
  );
}

export default ProductCard;
