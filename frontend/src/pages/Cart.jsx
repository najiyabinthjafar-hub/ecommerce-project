import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Cart.css";

const API_URL = "http://localhost:5000/api";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/cart`,
        authConfig
      );

      setCartItems(response.data.cart?.items || []);
    } catch (error) {
      console.error("GET CART ERROR:", error);

      if (error.response?.status === 401) {
        alert("Please login to view your cart.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.put(
        `${API_URL}/cart/update/${productId}`,
        {
          quantity,
        },
        authConfig
      );

      fetchCart();
    } catch (error) {
      console.error("UPDATE CART ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update cart"
      );
    }
  };

  const increaseQuantity = (productId, currentQuantity) => {
    updateQuantity(
      productId,
      currentQuantity + 1
    );
  };

  const decreaseQuantity = (
    productId,
    currentQuantity
  ) => {
    if (currentQuantity <= 1) {
      removeItem(productId);
      return;
    }

    updateQuantity(
      productId,
      currentQuantity - 1
    );
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(
        `${API_URL}/cart/remove/${productId}`,
        authConfig
      );

      fetchCart();
    } catch (error) {
      console.error("REMOVE CART ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to remove product"
      );
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => {
      const price =
        item.product?.salePrice ??
        item.product?.price ??
        0;

      return total + price * item.quantity;
    },
    0
  );

  const delivery =
    subtotal === 0
      ? 0
      : subtotal >= 999
      ? 0
      : 99;

  const total = subtotal + delivery;

  // ================= LOGIN CHECK =================

  if (!token) {
    return (
      <>
        <Navbar />

        <main className="cart-page">
          <section className="cart-heading">
            <p>YOUR BAG</p>
            <h1>SHOPPING CART</h1>

            <span>
              Please login to view your cart.
            </span>
          </section>

          <div className="empty-cart">
            <h2>Please Login</h2>

            <p>
              Login to view and manage your cart.
            </p>

            <Link
              to="/login"
              className="continue-shopping"
            >
              LOGIN
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // ================= LOADING =================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="cart-page">
          <section className="cart-heading">
            <p>YOUR BAG</p>

            <h1>SHOPPING CART</h1>

            <span>
              Loading your cart...
            </span>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  // ================= CART =================

  return (
    <>
      <Navbar />

      <main className="cart-page">
        <div className="cart-wrapper">

          {/* CART TOP */}

          <div className="cart-top">
            <h1>Your cart</h1>

            <Link
              to="/shop"
              className="continue-shopping"
            >
              Continue shopping
            </Link>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>

              <p>
                Looks like you haven't added anything yet.
              </p>

              <Link
                to="/shop"
                className="continue-shopping"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          ) : (
            <>

              {/* TABLE HEADER */}

              <div className="cart-header">
                <span>PRODUCT</span>

                <span>QUANTITY</span>

                <span>TOTAL</span>
              </div>

              {/* PRODUCTS */}

              <div className="cart-products">

                {cartItems.map((item) => {
                  const product = item.product;

                  const productId =
                    product?._id;

                  const price =
                    product?.salePrice ??
                    product?.price ??
                    0;

                  return (
                    <div
                      className="cart-item"
                      key={productId}
                    >

                      {/* PRODUCT */}

                      <div className="cart-product">

                        <div className="cart-product-image">

                          <img
                            src={
                              product?.image ||
                              product?.images?.[0] ||
                              "/placeholder.png"
                            }
                            alt={
                              product?.name ||
                              "Product"
                            }
                          />

                        </div>

                        <div className="cart-product-info">

                          <h3>
                            {product?.name ||
                              "Product"}
                          </h3>

                          <p>
                            ₹
                            {price.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                          {item.size && (
                            <p>
                              Size: {item.size}
                            </p>
                          )}

                          <button
                            className="remove-btn"
                            type="button"
                            onClick={() =>
                              removeItem(productId)
                            }
                          >
                            REMOVE
                          </button>

                        </div>

                      </div>

                      {/* QUANTITY */}

                      <div className="cart-quantity-area">

                        <div className="cart-quantity">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                productId,
                                item.quantity
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                productId,
                                item.quantity
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                      </div>

                      {/* TOTAL */}

                      <p className="cart-total">

                        ₹
                        {(
                          price *
                          item.quantity
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </p>

                    </div>
                  );
                })}

              </div>

              {/* BOTTOM AREA */}

              <div className="cart-bottom">

                <Link
                  to="/shop"
                  className="continue-shopping"
                >
                  ← CONTINUE SHOPPING
                </Link>

                <aside className="cart-summary">

                  <h2>ORDER SUMMARY</h2>

                  <div className="summary-row">

                    <span>
                      SUBTOTAL
                    </span>

                    <span>
                      ₹
                      {subtotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  <div className="summary-row">

                    <span>
                      DELIVERY
                    </span>

                    <span>
                      {delivery === 0
                        ? "FREE"
                        : `₹${delivery}`}
                    </span>

                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-total">

                    <span>
                      TOTAL
                    </span>

                    <strong>
                      ₹
                      {total.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                  <p className="summary-note">
                    Taxes included. Discounts
                    and shipping calculated at
                    checkout.
                  </p>

                  <Link
                    to="/checkout"
                    className="checkout-btn"
                  >
                    PROCEED TO CHECKOUT
                  </Link>

                </aside>

              </div>

            </>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Cart;