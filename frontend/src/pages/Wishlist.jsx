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

  // ================= WISHLIST =================

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  });

  // ================= REMOVE FROM WISHLIST =================

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((product) => {
      const id = product._id || product.id;

      return id !== productId;
    });

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  // ================= ADD TO CART =================

  const addToCart = (product) => {
    try {
      const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

      const productId = product._id || product.id;

      const existingProduct = cart.find((item) => {
        const itemId = item._id || item.id;

        return itemId === productId;
      });

      let updatedCart;

      if (existingProduct) {
        updatedCart = cart.map((item) => {
          const itemId = item._id || item.id;

          if (itemId === productId) {
            return {
              ...item,
              quantity: (item.quantity || 1) + 1,
            };
          }

          return item;
        });
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
    } catch (error) {
      console.error("Cart Error:", error);
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
              ← BACK TO PROFILE
            </button>
          )}

          {/* HEADING */}

          <section className="wishlist-heading">
            <h1>MY WISHLIST</h1>

            <span>
              Your favourite products in one place.
            </span>
          </section>

          {/* EMPTY WISHLIST */}

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

            /* WISHLIST PRODUCTS */

            <section className="wishlist-products">

              {wishlist.map((product) => {
                // ================= PRODUCT ID =================

                const productId =
                  product._id || product.id;

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
                    : product.regularPrice || product.price || 0;

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
                        ₹{" "}
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

            </section>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Wishlist;