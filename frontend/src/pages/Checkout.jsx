import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Checkout.css";

const API_URL = "http://localhost:5000/api";

function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState("");

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // =========================
  // GET CART
  // =========================

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/cart`,
          authConfig
        );

        setCartItems(response.data.cart?.items || []);
      } catch (error) {
        console.error("GET CART ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load cart"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // =========================
  // SUBTOTAL
  // =========================

  const subtotal = cartItems.reduce((total, item) => {
    const price =
      item.product?.salePrice ??
      item.product?.regularPrice ??
      0;

    return total + price * item.quantity;
  }, 0);

  // =========================
  // APPLY COUPON
  // =========================

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();

    setCouponMessage("");
    setCouponError("");

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    setCouponLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/coupons/code/${code}`
      );

      const coupon =
        response.data?.coupon ||
        response.data?.data ||
        response.data;

      if (!coupon) {
        throw new Error("Invalid coupon");
      }

      // Check active status
      if (coupon.isActive === false) {
        setCouponError("This coupon is inactive.");
        setDiscount(0);
        setAppliedCoupon(null);
        return;
      }

      // Check expiry
      if (
        coupon.expiry &&
        new Date(coupon.expiry) < new Date()
      ) {
        setCouponError("This coupon has expired.");
        setDiscount(0);
        setAppliedCoupon(null);
        return;
      }

      // Check minimum purchase
      if (
        coupon.minimumPurchase &&
        subtotal < coupon.minimumPurchase
      ) {
        setCouponError(
          `Minimum purchase of ₹${coupon.minimumPurchase} is required.`
        );
        setDiscount(0);
        setAppliedCoupon(null);
        return;
      }

      let calculatedDiscount = 0;

      // Percentage coupon
      if (coupon.discountType === "percentage") {
        calculatedDiscount =
          (subtotal * coupon.discountValue) / 100;

        // Maximum discount limit
        if (
          coupon.maxDiscount &&
          calculatedDiscount > coupon.maxDiscount
        ) {
          calculatedDiscount = coupon.maxDiscount;
        }
      }

      // Fixed coupon
      if (coupon.discountType === "fixed") {
        calculatedDiscount = coupon.discountValue;
      }

      // Discount cannot exceed subtotal
      if (calculatedDiscount > subtotal) {
        calculatedDiscount = subtotal;
      }

      calculatedDiscount = Math.max(
        0,
        calculatedDiscount
      );

      setDiscount(calculatedDiscount);
      setAppliedCoupon(coupon);

      setCouponMessage(
        `Coupon ${code} applied successfully.`
      );
    } catch (error) {
      console.error("COUPON ERROR:", error);

      setDiscount(0);
      setAppliedCoupon(null);

      setCouponError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Invalid coupon code."
      );
    } finally {
      setCouponLoading(false);
    }
  };

  // =========================
  // REMOVE COUPON
  // =========================

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponMessage("");
    setCouponError("");
  };

  // =========================
  // FINAL TOTAL
  // =========================

  const finalTotal = Math.max(
    0,
    subtotal - discount
  );

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    setError("");
    setPlacingOrder(true);

    try {
      const formData = new FormData(event.target);

      const shippingAddress = {
        fullName: `${formData.get("firstName")} ${formData.get(
          "lastName"
        )}`.trim(),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
        state: formData.get("state"),
        pincode: formData.get("pincode"),
      };

      const checkoutData = {
        userId,
        shippingAddress,
        paymentMethod: "COD",
      };

      if (appliedCoupon) {
        checkoutData.couponCode =
          couponCode.trim().toUpperCase();
      }

      const response = await axios.post(
        `${API_URL}/checkout`,
        checkoutData,
        authConfig
      );

      console.log(
        "CHECKOUT SUCCESS:",
        response.data
      );

      alert("Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error(
        "CHECKOUT ERROR:",
        error
      );

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Checkout failed"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // =========================
  // LOGIN REQUIRED
  // =========================

  if (!token) {
    return (
      <>
        <Navbar />

        <main className="checkout-page">
          <section className="checkout-heading">
            <p>CHECKOUT</p>

            <h1>LOGIN REQUIRED</h1>

            <span>
              Please login before proceeding to checkout.
            </span>
          </section>

          <div className="checkout-empty">
            <Link to="/login">
              LOGIN
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="checkout-page">
          <section className="checkout-heading">
            <p>CHECKOUT</p>

            <h1>LOADING...</h1>

            <span>
              Loading your cart...
            </span>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // EMPTY CART
  // =========================

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <main className="checkout-page">
          <section className="checkout-heading">
            <p>CHECKOUT</p>

            <h1>YOUR CART IS EMPTY</h1>

            <span>
              Add some products before proceeding to checkout.
            </span>
          </section>

          <div className="checkout-empty">
            <Link to="/shop">
              CONTINUE SHOPPING
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // MAIN CHECKOUT
  // =========================

  return (
    <>
      <Navbar />

      <main className="checkout-page">

        <section className="checkout-heading">
          <p>SECURE CHECKOUT</p>

          <h1>CHECKOUT</h1>

          <span>
            Complete your details to place your order.
          </span>
        </section>

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <div className="checkout-container">

          <form
            className="checkout-form"
            onSubmit={handlePlaceOrder}
          >

            {/* CONTACT */}

            <div className="checkout-section">

              <div className="checkout-section-title">
                <span>01</span>
                <h2>CONTACT INFORMATION</h2>
              </div>

              <div className="form-group">

                <label htmlFor="phone">
                  PHONE NUMBER
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                />

              </div>

            </div>

            {/* SHIPPING */}

            <div className="checkout-section">

              <div className="checkout-section-title">
                <span>02</span>
                <h2>SHIPPING ADDRESS</h2>
              </div>

              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="firstName">
                    FIRST NAME
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="lastName">
                    LAST NAME
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    required
                  />

                </div>

              </div>

              <div className="form-group">

                <label htmlFor="address">
                  ADDRESS
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="House / Street / Area"
                  required
                />

              </div>

              <div className="form-group">

                <label htmlFor="city">
                  CITY
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City"
                  required
                />

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="state">
                    STATE
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="State"
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="pincode">
                    PINCODE
                  </label>

                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    placeholder="Pincode"
                    required
                  />

                </div>

              </div>

            </div>

            {/* COUPON */}

            <div className="checkout-section">

              <div className="checkout-section-title">
                <span>03</span>
                <h2>COUPON</h2>
              </div>

              <div className="form-group">

                <label htmlFor="couponCode">
                  COUPON CODE
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >

                  <input
                    id="couponCode"
                    name="couponCode"
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(event) =>
                      setCouponCode(
                        event.target.value.toUpperCase()
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="place-order-btn"
                    style={{
                      width: "auto",
                      padding: "12px 20px",
                    }}
                  >
                    {couponLoading
                      ? "APPLYING..."
                      : "APPLY"}
                  </button>

                </div>

              </div>

              {couponMessage && (
                <p
                  style={{
                    color: "green",
                    marginTop: "8px",
                  }}
                >
                  {couponMessage}
                </p>
              )}

              {couponError && (
                <p
                  style={{
                    color: "red",
                    marginTop: "8px",
                  }}
                >
                  {couponError}
                </p>
              )}

              {appliedCoupon && (
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  style={{
                    marginTop: "8px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Remove Coupon
                </button>
              )}

            </div>

            {/* PAYMENT */}

            <div className="checkout-section">

              <div className="checkout-section-title">
                <span>04</span>
                <h2>PAYMENT</h2>
              </div>

              <div className="payment-box">

                <div className="payment-option">

                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="COD"
                    defaultChecked
                  />

                  <label htmlFor="cod">

                    <strong>
                      CASH ON DELIVERY
                    </strong>

                    <small>
                      Pay when your order arrives.
                    </small>

                  </label>

                </div>

              </div>

            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={placingOrder}
            >
              {placingOrder
                ? "PLACING ORDER..."
                : "PLACE ORDER"}
            </button>

          </form>

          {/* ORDER SUMMARY */}

          <aside className="checkout-summary">

            <h2>ORDER SUMMARY</h2>

            <div className="checkout-products">

              {cartItems.map((item) => {

                const product = item.product;

                const price =
                  product?.salePrice ??
                  product?.regularPrice ??
                  0;

                return (
                  <div
                    className="checkout-product"
                    key={product?._id}
                  >

                    <div className="checkout-product-image">

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

                    <div className="checkout-product-info">

                      <h3>
                        {product?.name ||
                          "Product"}
                      </h3>

                      <p>
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <strong>
                      ₹
                      {(
                        price *
                        item.quantity
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>
                );
              })}

            </div>

            <div className="checkout-summary-divider"></div>

            {/* SUBTOTAL */}

            <div className="checkout-summary-row">

              <span>SUBTOTAL</span>

              <span>
                ₹
                {subtotal.toLocaleString("en-IN")}
              </span>

            </div>

            {/* DISCOUNT */}

            {discount > 0 && (
              <div className="checkout-summary-row">

                <span>
                  DISCOUNT
                  {appliedCoupon?.code
                    ? ` (${appliedCoupon.code})`
                    : ""}
                </span>

                <span>
                  -₹
                  {discount.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>
            )}

            <div className="checkout-summary-divider"></div>

            {/* FINAL TOTAL */}

            <div className="checkout-summary-total">

              <span>TOTAL</span>

              <strong>
                ₹
                {finalTotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <Link
              to="/cart"
              className="back-to-cart"
            >
              ← EDIT CART
            </Link>

          </aside>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default Checkout;