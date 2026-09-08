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

  const isWishlisted = wishlist.some(
    (item) => item.id === product.id
  );

  const handleWishlist = (e) => {
    e.preventDefault();

    let updatedWishlist;

    if (isWishlisted) {
      updatedWishlist = wishlist.filter(
        (item) => item.id !== product.id
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
      <Link to={`/product/${product.id}`}>

        <div className="product-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </div>

        <div className="product-info">
          <h3>{product.name}</h3>

          <p className="product-price">
            ₹ {product.price}/-
          </p>
        </div>

      </Link>

    </div>
  );
}

export default ProductCard;