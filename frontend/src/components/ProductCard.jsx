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

  const productImage =
    product.images?.[0] ||
    product.image ||
    "https://via.placeholder.com/300";

  // ================= PRODUCT PRICE =================

  const productPrice =
    product.salePrice !== null &&
    product.salePrice !== undefined
      ? product.salePrice
      : product.regularPrice || product.price;

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