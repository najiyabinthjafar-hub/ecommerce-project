import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Cart.css";

const API_URL = "http://localhost:5000/api";

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItem, setUpdatingItem] = useState(null);

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

  // ================= FETCH CART =================

  const fetchCart = async () => {
    const token = getToken();

    if (!token) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/cart`,
        getAuthConfig()
      );

      setCartItems(response.data.cart?.items || []);
    } catch (error) {
      console.error("GET CART ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch cart"
      );

      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ================= UPDATE QUANTITY =================

  const updateQuantity = async (
    productId,
    newQuantity
  ) => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    if (newQuantity < 1) {
      await removeItem(productId);
      return;
    }

    try {
      setUpdatingItem(productId);

      await axios.put(
        `${API_URL}/cart/update/${productId}`,
        {
          quantity: newQuantity,
        },
        getAuthConfig()
      );

      await fetchCart();
    } catch (error) {
      console.error("UPDATE CART ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update cart"
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  // ================= INCREASE =================

  const increaseQuantity = (item) => {
    const productId =
      item.product?._id ||
      item.product?.id ||
      item.product;

    updateQuantity(
      productId,
      item.quantity + 1
    );
  };

  // ================= DECREASE =================

  const decreaseQuantity = (item) => {
    const productId =
      item.product?._id ||
      item.product?.id ||
      item.product;

    updateQuantity(
      productId,
      item.quantity - 1
    );
  };

  // ================= REMOVE ITEM =================

  const removeItem = async (productId) => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setUpdatingItem(productId);

      await axios.delete(
        `${API_URL}/cart/remove/${productId}`,
        getAuthConfig()
      );

      await fetchCart();
    } catch (error) {
      console.error("REMOVE CART ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to remove product"
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  // ================= PRODUCT DATA =================

  const getProductData = (item) => {
    const product =
      typeof item.product === "object"
        ? item.product
        : {};

    const productId =
      product._id ||
      product.id ||
      item.product;

    const productName =
      product.name || "Product";

    const productPrice =
      product.salePrice ??
      product.regularPrice ??
      product.price ??
      item.price ??
      0;

    const productImage =
      product.image ||
      product.images?.[0] ||
      item.image ||
      "/placeholder.png";

    return {
      productId,
      productName,
      productPrice: Number(productPrice),
      productImage,
    };
  };

  // ================= SUBTOTAL =================

  const subtotal = cartItems.reduce(
    (total, item) => {
      const { productPrice } =
        getProductData(item);

      return (
        total +
        productPrice * item.quantity
      );
    },
    0
  );

  // ================= DELIVERY =================

  const delivery =
    subtotal === 0
      ? 0
      : subtotal >= 999
      ? 0
      : 99;

  const total = subtotal + delivery;

  // ================= LOGIN CHECK =================

  if (!getToken()) {
    return (
      <>
        <Navbar />

        <main className="cart-page">
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
          <div className="cart-wrapper">
            <p className="no-products">
              Loading cart...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

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

          {/* ERROR */}

          {error && (
            <p className="no-products">
              {error}
            </p>
          )}

          {/* EMPTY CART */}

          {!error &&
          cartItems.length === 0 ? (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>

              <p>
                Looks like you haven't added anything yet.
              </p>

              <Link
                to="/shop"
                className="continue-shopping"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            !error && (
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
                    const {
                      productId,
                      productName,
                      productPrice,
                      productImage,
                    } = getProductData(item);

                    const itemTotal =
                      productPrice *
                      item.quantity;

                    const isUpdating =
                      updatingItem === productId;

                    return (
                      <div
                        className="cart-item"
                        key={productId}
                      >
                        {/* PRODUCT */}

                        <div className="cart-product">
                          <div className="cart-product-image">
                            <Link
                              to={`/product/${productId}`}
                            >
                              <img
                                src={productImage}
                                alt={productName}
                              />
                            </Link>
                          </div>

                          <div className="cart-product-info">
                            <h3>
                              {productName}
                            </h3>

                            <p>
                              ₹
                              {productPrice.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                            {item.size && (
                              <p>
                                Size: {item.size}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* QUANTITY */}

                        <div className="cart-quantity-area">
                          <div className="cart-quantity">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(item)
                              }
                              disabled={isUpdating}
                            >
                              −
                            </button>

                            <span>
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(item)
                              }
                              disabled={isUpdating}
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="remove-btn"
                            type="button"
                            onClick={() =>
                              removeItem(productId)
                            }
                            disabled={isUpdating}
                          >
                            REMOVE
                          </button>
                        </div>

                        {/* TOTAL */}

                        <p className="cart-total">
                          ₹
                          {itemTotal.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* BOTTOM */}

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
                      <span>SUBTOTAL</span>

                      <span>
                        ₹
                        {subtotal.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>

                    <div className="summary-row">
                      <span>DELIVERY</span>

                      <span>
                        {delivery === 0
                          ? "FREE"
                          : `₹${delivery}`}
                      </span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-total">
                      <span>TOTAL</span>

                      <strong>
                        ₹
                        {total.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                    <p className="summary-note">
                      Taxes included. Discounts and
                      shipping calculated at checkout.
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
            )
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Cart;