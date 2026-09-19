import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import logo from "../assets/logo.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Checkout.css";

const API_URL = "http://localhost:5000/api";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // ================= BUY NOW DATA =================

  const buyNowProduct = location.state?.buyNow
    ? location.state.product
    : null;

  const isBuyNow = Boolean(buyNowProduct);

  // ================= STATES =================

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState("");

  // COD default
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [billingAddress, setBillingAddress] = useState("same");

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ================= GET USER EMAIL =================

  const getUserEmail = () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      return user.email || "";
    } catch {
      return "";
    }
  };

  // ================= GET CART OR BUY NOW PRODUCT =================

  useEffect(() => {
    const fetchCheckoutItems = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      // ================= BUY NOW =================

      if (isBuyNow && buyNowProduct) {
        setCartItems([
          {
            product: buyNowProduct,
            quantity: buyNowProduct.quantity || 1,
            size: buyNowProduct.selectedSize || "",
          },
        ]);

        setLoading(false);
        return;
      }

      // ================= CART CHECKOUT =================

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/cart`,
          authConfig
        );

        setCartItems(
          response.data.cart?.items || []
        );
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

    fetchCheckoutItems();
  }, [token, isBuyNow, buyNowProduct]);

  // ================= SUBTOTAL =================

  const subtotal = cartItems.reduce(
    (total, item) => {
      const product = item.product || {};

      const price =
        product.salePrice ??
        product.regularPrice ??
        product.price ??
        item.price ??
        0;

      return (
        total +
        Number(price) * Number(item.quantity)
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

  // ================= FINAL TOTAL =================

  const finalTotal = Math.max(
    0,
    subtotal + delivery - discount
  );

  // ================= APPLY COUPON =================

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();

    setCouponMessage("");
    setCouponError("");

    if (!code) {
      setCouponError(
        "Please enter a coupon code."
      );
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

      // Active check
      if (coupon.isActive === false) {
        setCouponError(
          "This coupon is inactive."
        );

        setDiscount(0);
        setAppliedCoupon(null);
        return;
      }

      // Expiry check
      const expiryDate =
        coupon.expiryDate || coupon.expiry;

      if (
        expiryDate &&
        new Date(expiryDate) < new Date()
      ) {
        setCouponError(
          "This coupon has expired."
        );

        setDiscount(0);
        setAppliedCoupon(null);
        return;
      }

      // Minimum purchase
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

      // Percentage discount
      if (
        coupon.discountType === "percentage"
      ) {
        calculatedDiscount =
          (subtotal * coupon.discountValue) /
          100;

        const maxDiscount =
          coupon.maxDiscount ||
          coupon.maximumDiscount;

        if (
          maxDiscount &&
          calculatedDiscount > maxDiscount
        ) {
          calculatedDiscount = maxDiscount;
        }
      }

      // Fixed discount
      if (
        coupon.discountType === "fixed"
      ) {
        calculatedDiscount =
          coupon.discountValue;
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
      console.error(
        "COUPON ERROR:",
        error
      );

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

  // ================= REMOVE COUPON =================

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponMessage("");
    setCouponError("");
  };

  // ================= PLACE ORDER =================

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    setError("");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!userId) {
      setError(
        "User information not found. Please login again."
      );
      return;
    }

    if (cartItems.length === 0) {
      setError(
        "No products available to place the order."
      );
      return;
    }

    // ================= RAZORPAY UI ONLY =================

    if (paymentMethod === "razorpay") {
      alert(
        "Razorpay payment integration will be available soon."
      );

      return;
    }

    setPlacingOrder(true);

    try {
      const formData = new FormData(
        event.target
      );

      // ================= SHIPPING ADDRESS =================

      const shippingAddress = {
        fullName: `${formData.get(
          "firstName"
        )} ${formData.get("lastName")}`.trim(),

        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
        state: formData.get("state"),
        pincode: formData.get("pincode"),
      };

      // ================= ORDER ITEMS =================

      const orderItems = cartItems.map(
        (item) => {
          const product = item.product || {};

          const price =
            product.salePrice ??
            product.regularPrice ??
            product.price ??
            item.price ??
            0;

          return {
            product:
              product._id ||
              product.id ||
              item.product,

            quantity: item.quantity,

            price: price,

            size: item.size || "",
          };
        }
      );

      // ================= ORDER DATA =================

      const orderData = {
        user: userId,

        items: orderItems,

        shippingAddress,

        totalAmount: subtotal,

        discountAmount: discount,

        finalAmount: finalTotal,

        // COD
        paymentMethod: "COD",
      };

      console.log(
        "ORDER DATA:",
        orderData
      );

      // ================= CREATE ORDER =================

      const response = await axios.post(
        `${API_URL}/orders`,
        orderData,
        authConfig
      );

      console.log(
        "ORDER SUCCESS:",
        response.data
      );

      alert(
        "Order placed successfully!"
      );

      navigate("/orders");
    } catch (error) {
      console.error(
        "ORDER ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to place order"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // ================= LOGIN REQUIRED =================

  if (!token) {
    return (
      <>
        <Navbar />

        <main className="checkout-page">
          <section className="checkout-heading">
            <p>CHECKOUT</p>

            <h1>LOGIN REQUIRED</h1>

            <span>
              Please login before proceeding to
              checkout.
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

  // ================= LOADING =================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="checkout-page">
          <section className="checkout-heading">
            <p>CHECKOUT</p>

            <h1>LOADING...</h1>

            <span>
              Loading your products...
            </span>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  // ================= EMPTY =================

  if (cartItems.length === 0) {
    return (
      <main className="checkout-empty-page">

        <div className="checkout-empty-logo">
          <img src={logo} alt="Rizo" />
        </div>

        <div className="checkout-empty">
          <h2>
            Your cart is empty
          </h2>

          <button
            onClick={() =>
              navigate("/shop")
            }
          >
            CONTINUE SHOPPING
          </button>
        </div>

      </main>
    );
  }

  // ================= MAIN CHECKOUT =================

  return (
    <>
      <main className="figma-checkout">

        {/* ================= MOBILE BACK BUTTON ================= */}

        <button
          type="button"
          className="checkout-back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ←
        </button>

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <form
          className="figma-checkout-container"
          onSubmit={handlePlaceOrder}
        >

          {/* ================= LEFT SIDE ================= */}

          <section className="delivery-section">

            <div className="checkout-logo">
              <img
                src={logo}
                alt="Rizo"
              />
            </div>

            <h2 className="delivery-title">
              Delivery
            </h2>

            {/* COUNTRY */}

            <div className="checkout-field">

              <label>
                Country/region
              </label>

              <select
                name="country"
                defaultValue="India"
              >
                <option value="India">
                  India
                </option>
              </select>

            </div>

            {/* NAME */}

            <div className="checkout-row">

              <div className="checkout-field">

                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  required
                />

              </div>

              <div className="checkout-field">

                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  required
                />

              </div>

            </div>

            {/* ADDRESS */}

            <div className="checkout-field">

              <input
                type="text"
                name="address"
                placeholder="Address"
                required
              />

            </div>

            <div className="checkout-field">

              <input
                type="text"
                name="apartment"
                placeholder="Apartment, suite, etc. (optional)"
              />

            </div>

            {/* CITY STATE PIN */}

            <div className="checkout-location-row">

              <div className="checkout-field">

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  required
                />

              </div>

              <div className="checkout-field">

                <select
                  name="state"
                  defaultValue="Kerala"
                  required
                >
                  <option value="Kerala">
                    Kerala
                  </option>

                  <option value="Tamil Nadu">
                    Tamil Nadu
                  </option>

                  <option value="Karnataka">
                    Karnataka
                  </option>

                  <option value="Maharashtra">
                    Maharashtra
                  </option>

                  <option value="Delhi">
                    Delhi
                  </option>
                </select>

              </div>

              <div className="checkout-field">

                <input
                  type="text"
                  name="pincode"
                  placeholder="PIN code"
                  pattern="[0-9]{6}"
                  title="Please enter a valid 6-digit PIN code"
                  required
                />

              </div>

            </div>

            {/* PHONE */}

            <div className="checkout-field">

              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                required
              />

            </div>

            <input
              type="hidden"
              name="email"
              value={getUserEmail()}
              readOnly
            />

            {/* SAVE INFO */}

            <label className="save-info">

              <input
                type="checkbox"
                name="saveInfo"
              />

              <span>
                Save this information for next time
              </span>

            </label>

            {/* COUPON */}

            <div className="coupon-section">

              <h2>
                Discount code
              </h2>

              <div className="discount-box">

                <input
                  type="text"
                  placeholder="Discount code or gift card"
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
                >
                  {couponLoading
                    ? "Applying..."
                    : "Apply"}
                </button>

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
                  onClick={
                    handleRemoveCoupon
                  }
                  style={{
                    marginTop: "8px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration:
                      "underline",
                  }}
                >
                  Remove Coupon
                </button>
              )}

            </div>

          </section>

          {/* ================= RIGHT SIDE ================= */}

          <section className="checkout-right">

            {/* PRODUCTS */}

            <div className="order-summary-products">

              {cartItems.map(
                (item, index) => {
                  const product =
                    item.product || {};

                  const productId =
                    product._id ||
                    product.id ||
                    index;

                  const price =
                    product.salePrice ??
                    product.regularPrice ??
                    product.price ??
                    item.price ??
                    0;

                  let image =
                    product.image ||
                    product.images?.[0] ||
                    item.image ||
                    "/placeholder.png";

                  if (
                    image &&
                    !image.startsWith("http")
                  ) {
                    image = `http://localhost:5000${
                      image.startsWith("/")
                        ? ""
                        : "/"
                    }${image}`;
                  }

                  return (
                    <div
                      className="figma-product"
                      key={productId}
                    >

                      <div className="figma-product-image">

                        <img
                          src={image}
                          alt={
                            product.name ||
                            "Product"
                          }
                        />

                        <span className="product-quantity">
                          {item.quantity}
                        </span>

                      </div>

                      <div className="figma-product-name">

                        <h4>
                          {product.name ||
                            "Product"}
                        </h4>

                        {item.size && (
                          <small>
                            Size: {item.size}
                          </small>
                        )}

                      </div>

                      <strong>
                        ₹
                        {(
                          price *
                          item.quantity
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>
                  );
                }
              )}

            </div>

            {/* PRICE DETAILS */}

            <div className="price-details">

              <div className="price-row">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {discount > 0 && (
                <div className="price-row">

                  <span>
                    Discount
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

              <div className="price-row">

                <span>
                  Shipping
                </span>

                <span className="shipping-value">
                  {delivery === 0
                    ? "FREE"
                    : `₹${delivery}`}
                </span>

              </div>

            </div>

            {/* TOTAL */}

            <div className="figma-total">

              <div>

                <h2>
                  Total
                </h2>

                <small>
                  Including taxes
                </small>

              </div>

              <strong>

                <span className="currency">
                  INR
                </span>

                ₹
                {finalTotal.toLocaleString(
                  "en-IN"
                )}

              </strong>

            </div>

            {/* PAYMENT */}

            <div className="payment-section">

              <h2>
                Payment
              </h2>

              <p className="payment-subtitle">
                All transactions are secure
                and encrypted.
              </p>

              {/* COD */}

              <label
                className={`payment-method ${
                  paymentMethod === "cod"
                    ? "active-payment"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={
                    paymentMethod === "cod"
                  }
                  onChange={() =>
                    setPaymentMethod(
                      "cod"
                    )
                  }
                />

                <div className="payment-method-content">

                  <strong>
                    Cash on Delivery
                  </strong>

                </div>

                <span className="payment-icons">
                  COD
                </span>

              </label>

              {paymentMethod === "cod" && (
                <div className="payment-info-box cod-info">

                  <p>
                    You can pay cash when
                    your order is delivered.
                  </p>

                </div>
              )}

              {/* RAZORPAY */}

              <label
                className={`payment-method ${
                  paymentMethod ===
                  "razorpay"
                    ? "active-payment"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={
                    paymentMethod ===
                    "razorpay"
                  }
                  onChange={() =>
                    setPaymentMethod(
                      "razorpay"
                    )
                  }
                />

                <div className="payment-method-content">

                  <strong>
                    Razorpay
                    (UPI, Cards & NetBanking)
                  </strong>

                </div>

                <span className="payment-icons">
                  UPI&nbsp;&nbsp;VISA&nbsp;&nbsp;MC
                </span>

              </label>

              {paymentMethod ===
                "razorpay" && (
                <div className="payment-info-box">

                  <p>
                    Razorpay payment gateway
                    UI is ready. Payment API
                    integration will be added
                    later.
                  </p>

                </div>
              )}

            </div>

            {/* BILLING */}

            <div className="billing-section">

              <h2>
                Billing address
              </h2>

              <label className="billing-option">

                <input
                  type="radio"
                  name="billing"
                  value="same"
                  checked={
                    billingAddress ===
                    "same"
                  }
                  onChange={() =>
                    setBillingAddress(
                      "same"
                    )
                  }
                />

                <span>
                  Same as shipping address
                </span>

              </label>

              <label className="billing-option">

                <input
                  type="radio"
                  name="billing"
                  value="different"
                  checked={
                    billingAddress ===
                    "different"
                  }
                  onChange={() =>
                    setBillingAddress(
                      "different"
                    )
                  }
                />

                <span>
                  Use a different billing
                  address
                </span>

              </label>

            </div>

            {/* PLACE ORDER */}

            <button
              type="submit"
              className="figma-pay-button"
              disabled={placingOrder}
            >
              {placingOrder
                ? "PLACING ORDER..."
                : paymentMethod === "cod"
                ? "PLACE ORDER"
                : "PAY WITH RAZORPAY"}
            </button>

            {/* POLICY LINKS */}

            <div className="checkout-policy-links">

              <Link to="/refund-policy">
                Refund policy
              </Link>

              <span>|</span>

              <Link to="/shipping-policy">
                Shipping policy
              </Link>

              <span>|</span>

              <Link to="/privacy-policy">
                Privacy policy
              </Link>

              <span>|</span>

              <Link to="/terms-of-service">
                Terms of service
              </Link>

            </div>

          </section>

        </form>
      </main>

      <Footer />
    </>
  );
}

export default Checkout;