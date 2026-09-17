import { useState } from "react";
import { Link } from "react-router-dom";

import "./ProductCard.css";

function ProductCard({ product }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  });

  // ================= PRODUCT ID =================

  const productId = product._id || product.id;

  // ================= PRODUCT IMAGE =================

  let productImage =
    product.images?.[0] ||
    product.image ||
    "";

  // If image is stored as a relative backend path
  if (
    productImage &&
    !productImage.startsWith("http") &&
    !productImage.startsWith("data:")
  ) {
    productImage = `http://localhost:5000${productImage.startsWith("/")
      ? ""
      : "/"}${productImage}`;
  }

  // Fallback image
  if (!productImage) {
    productImage = "https://via.placeholder.com/500x600?text=No+Image";
  }

  // ================= PRODUCT PRICE =================

  const productPrice =
    product.salePrice !== null &&
    product.salePrice !== undefined &&
    product.salePrice !== ""
      ? product.salePrice
      : product.regularPrice ?? product.price ?? 0;

  // ================= WISHLIST CHECK =================

  const isWishlisted = wishlist.some(
    (item) => (item._id || item.id) === productId
  );

  // ================= WISHLIST =================

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let updatedWishlist;

    if (isWishlisted) {
      updatedWishlist = wishlist.filter(
        (item) => (item._id || item.id) !== productId
      );
    } else {
      updatedWishlist = [...wishlist, product];
    }

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );
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
        className={`wishlist-btn ${
          isWishlisted ? "active-wishlist" : ""
        }`}
        onClick={handleWishlist}
        aria-label="Add to wishlist"
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
          <h3>{product.name || "Product Name"}</h3>

          <p className="product-price">
            ₹ {Number(productPrice).toLocaleString("en-IN")}/-
          </p>
        </div>
      </Link>

    </div>
  );
}

export default ProductCard;