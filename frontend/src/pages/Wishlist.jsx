import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Wishlist.css";

function Wishlist() {
  const navigate = useNavigate();
  const location = useLocation();

  // Profile page-il ninn vannal mathram true
  const showBackToProfile = location.state?.fromProfile === true;

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  });

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(
      (product) => product.id !== id
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  const addToCart = (product) => {
    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          quantity: 1,
          size: product.size || "M",
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    alert(`${product.name} added to cart!`);
  };

  return (
    <>
      <Navbar />

      <main className="wishlist-page">
        <div className="wishlist-container">

          {/* Show only when coming from Profile */}
          {showBackToProfile && (
            <button
              className="wishlist-back-btn"
              onClick={() => navigate("/profile")}
            >
              ← BACK TO PROFILE
            </button>
          )}

          <section className="wishlist-heading">

            <h1>MY WISHLIST</h1>

            <span>
              Your favourite products in one place.
            </span>
          </section>

          {wishlist.length === 0 ? (
            <section className="wishlist-empty">
              <div className="empty-heart">♡</div>

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
            <section className="wishlist-products">
              {wishlist.map((product) => (
                <article
                  className="wishlist-card"
                  key={product.id}
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="wishlist-image"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  </Link>

                  <div className="wishlist-info">
                    <h3>{product.name}</h3>

                    <p>
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div className="wishlist-actions">
                    <button
                      className="wishlist-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      ADD TO CART
                    </button>

                    <button
                      className="wishlist-remove-btn"
                      onClick={() =>
                        removeFromWishlist(product.id)
                      }
                    >
                      REMOVE
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Wishlist;