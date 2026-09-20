import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Checkout.css";

const API_URL = "http://localhost:5000/api";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================================================
  // BUY NOW
  // =========================================================

  const buyNowProduct = location.state?.buyNow
    ? location.state.product
    : null;

  const isBuyNow = Boolean(buyNowProduct);

  // =========================================================
  // STATES
  // =========================================================

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [billingAddress, setBillingAddress] = useState("same");

  const [error, setError] = useState("");

  // =========================================================
  // AUTH
  // =========================================================

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // =========================================================
  // FETCH CART
  // =========================================================

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCart();
  }, [token, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/cart`,
        authConfig
      );

      setCart(response.data.cart || response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");

        navigate("/login");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load cart."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CART HELPERS
  // =========================================================

  const getCartItems = () => {
    if (isBuyNow && buyNowProduct) {
      return [
        {
          product: buyNowProduct,
          quantity: buyNowProduct.quantity || 1,
          size: buyNowProduct.selectedSize || "",
        },
      ];
    }

    if (!cart) {
      return [];
    }

    return cart.items || cart.products || [];
  };

  const getProduct = (item) => {
    return item.product || item.productId || item;
  };

  const getQuantity = (item) => {
    return Number(item.quantity || 1);
  };

  const getPrice = (item) => {
    const product = getProduct(item);

    return Number(
      product.salePrice ??
        product.regularPrice ??
        product.price ??
        item.price ??
        0
    );
  };

  const cartItems = getCartItems();

  // =========================================================
  // PRICE CALCULATIONS
  // =========================================================

  const subtotal = cartItems.reduce(
    (total, item) => {
      return (
        total +
        getPrice(item) * getQuantity(item)
      );
    },
    0
  );

  const deliveryCharge =
    subtotal >= 999 || subtotal === 0
      ? 0
      : 99;

  const discount = coupon?.discountAmount || 0;

  const totalAmount = Math.max(
    0,
    subtotal + deliveryCharge - discount
  );

  // =========================================================
  // COUPON
  // =========================================================

  const validateCoupon = async () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponMessage("Please enter a coupon code.");
      setCoupon(null);
      return;
    }

    try {
      setCouponLoading(true);
      setCouponMessage("");

      const response = await axios.get(
        `${API_URL}/coupons/code/${code}`,
        authConfig
      );

      const couponData =
        response.data.coupon ||
        response.data;

      if (!couponData) {
        setCoupon(null);
        setCouponMessage("Invalid coupon.");
        return;
      }

      // Active check
      if (
        couponData.active === false ||
        couponData.isActive === false
      ) {
        setCoupon(null);
        setCouponMessage(
          "This coupon is inactive."
        );
        return;
      }

      // Expiry check
      const expiryDate =
        couponData.expiryDate ||
        couponData.expiry;

      if (
        expiryDate &&
        new Date(expiryDate) < new Date()
      ) {
        setCoupon(null);
        setCouponMessage(
          "This coupon has expired."
        );
        return;
      }

      // Minimum purchase
      const minimumPurchase = Number(
        couponData.minimumPurchase || 0
      );

      if (subtotal < minimumPurchase) {
        setCoupon(null);

        setCouponMessage(
          `Minimum purchase should be ₹${minimumPurchase}.`
        );

        return;
      }

      // Calculate discount
      let discountAmount = 0;

      const discountType =
        couponData.discountType ||
        couponData.type;

      const discountValue = Number(
        couponData.discountValue ||
          couponData.discount ||
          0
      );

      if (discountType === "percentage") {
        discountAmount =
          (subtotal * discountValue) / 100;
      } else {
        discountAmount = discountValue;
      }

      // Maximum discount
      if (couponData.maxDiscount) {
        discountAmount = Math.min(
          discountAmount,
          Number(couponData.maxDiscount)
        );
      }

      if (couponData.maximumDiscount) {
        discountAmount = Math.min(
          discountAmount,
          Number(couponData.maximumDiscount)
        );
      }

      // Discount cannot exceed subtotal
      discountAmount = Math.min(
        discountAmount,
        subtotal
      );

      discountAmount = Math.max(
        0,
        discountAmount
      );

      setCoupon({
        ...couponData,
        discountAmount,
      });

      setCouponMessage(
        `Coupon ${
          couponData.code || code
        } applied successfully.`
      );
    } catch (error) {
      console.error("Coupon error:", error);

      setCoupon(null);

      setCouponMessage(
        error.response?.data?.message ||
          "Invalid coupon code."
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponMessage("");
  };

  // =========================================================
  // PLACE ORDER
  // =========================================================

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

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

    // Razorpay UI is ready, actual integration later
    if (paymentMethod === "razorpay") {
      alert(
        "Razorpay payment integration will be added later."
      );

      return;
    }

    if (paymentMethod !== "cod") {
      alert(
        "Online payment is not available yet. Please select Cash on Delivery."
      );

      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const formData = new FormData(
        event.currentTarget
      );

      // =====================================================
      // SHIPPING ADDRESS
      // =====================================================

      const firstName =
        formData.get("firstName") || "";

      const lastName =
        formData.get("lastName") || "";

      const shippingAddress = {
        fullName:
          `${firstName} ${lastName}`.trim(),

        phone:
          formData.get("phone") || "",

        address:
          formData.get("address") || "",

        apartment:
          formData.get("apartment") || "",

        city:
          formData.get("city") || "",

        state:
          formData.get("state") || "",

        pincode:
          formData.get("pincode") || "",

        country:
          formData.get("country") ||
          "India",
      };

      // =====================================================
      // VALIDATION
      // =====================================================

      if (!shippingAddress.fullName) {
        alert("Please enter your name.");
        setPlacingOrder(false);
        return;
      }

      if (!shippingAddress.phone) {
        alert("Please enter your phone number.");
        setPlacingOrder(false);
        return;
      }

      if (!shippingAddress.address) {
        alert("Please enter your address.");
        setPlacingOrder(false);
        return;
      }

      if (!shippingAddress.city) {
        alert("Please enter your city.");
        setPlacingOrder(false);
        return;
      }

      if (!shippingAddress.state) {
        alert("Please select your state.");
        setPlacingOrder(false);
        return;
      }

      if (!shippingAddress.pincode) {
        alert("Please enter your pincode.");
        setPlacingOrder(false);
        return;
      }

      // =====================================================
      // ORDER ITEMS
      // =====================================================

      const orderItems = cartItems.map(
        (item) => {
          const product = getProduct(item);

          return {
            product:
              product._id ||
              product.id ||
              item.product,

            quantity:
              getQuantity(item),

            price:
              getPrice(item),

            size:
              item.size ||
              item.selectedSize ||
              "",
          };
        }
      );

      // =====================================================
      // ORDER DATA
      // =====================================================

      const orderData = {
        user: userId,

        items: orderItems,

        shippingAddress,

        totalAmount: subtotal,

        discountAmount: discount,

        finalAmount: totalAmount,

        couponCode:
          coupon?.code ||
          couponCode.trim().toUpperCase() ||
          null,

        paymentMethod: "COD",
      };

      console.log(
        "ORDER DATA:",
        orderData
      );

      // =====================================================
      // CREATE ORDER
      // =====================================================

      const response = await axios.post(
        `${API_URL}/orders`,
        orderData,
        authConfig
      );

      console.log(
        "ORDER SUCCESS:",
        response.data
      );

      alert("Order placed successfully!");

      if (!isBuyNow) {
        await fetchCart();
      }

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
          "Failed to place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // =========================================================
  // LOGIN CHECK
  // =========================================================

  if (!token) {
    return (
      <>
        <Navbar />

        <main className="checkout-empty-page">
          <div className="checkout-empty">
            <h2>Login Required</h2>

            <p>
              Please login before proceeding
              to checkout.
            </p>

            <Link
              to="/login"
              className="checkout-shop-btn"
            >
              LOGIN
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="checkout-loading">
          Loading checkout...
        </div>

        <Footer />
      </>
    );
  }

  // =========================================================
  // EMPTY CART
  // =========================================================

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <main className="checkout-empty-page">
          <div className="checkout-empty-logo">
            <img
              src="/logo.png"
              alt="Rizo"
            />
          </div>

          <div className="checkout-empty">
            <h2>
              Your cart is empty
            </h2>

            <p>
              Add some products to your
              cart before checkout.
            </p>

            <button
              onClick={() =>
                navigate("/shop")
              }
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================================
  // CHECKOUT PAGE
  // =========================================================

  return (
    <>
      <Navbar />

      <main className="figma-checkout">

        {/* MOBILE BACK BUTTON */}

        <button
          type="button"
          className="checkout-back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ←
        </button>

        {/* ERROR */}

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <form
          className="figma-checkout-container"
          onSubmit={handlePlaceOrder}
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <section className="delivery-section">

            {/* LOGO */}

            <div className="checkout-logo">
              <img
                src="/logo.png"
                alt="Rizo"
              />
            </div>

            {/* DELIVERY */}

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

            {/* APARTMENT */}

            <div className="checkout-field">
              <input
                type="text"
                name="apartment"
                placeholder="Apartment, suite, etc. (optional)"
              />
            </div>

            {/* CITY / STATE / PIN */}

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

            {/* =================================================
                COUPON
            ================================================= */}

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
                  disabled={!!coupon}
                />

                {!coupon ? (
                  <button
                    type="button"
                    onClick={validateCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading
                      ? "Applying..."
                      : "Apply"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={removeCoupon}
                  >
                    Remove
                  </button>
                )}

              </div>

              {couponMessage && (
                <p className="coupon-message">
                  {couponMessage}
                </p>
              )}

            </div>

          </section>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <section className="checkout-right">

            {/* PRODUCTS */}

            <div className="order-summary-products">

              {cartItems.map(
                (item, index) => {
                  const product =
                    getProduct(item);

                  const productId =
                    product._id ||
                    product.id ||
                    index;

                  const price =
                    getPrice(item);

                  const quantity =
                    getQuantity(item);

                  let image =
                    product.image ||
                    product.images?.[0] ||
                    item.image ||
                    "/placeholder.png";

                  if (
                    image &&
                    !image.startsWith("http")
                  ) {
                    image =
                      `http://localhost:5000${
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
                          {quantity}
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
                          price * quantity
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
                    {coupon?.code
                      ? ` (${coupon.code})`
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
                  {deliveryCharge === 0
                    ? "FREE"
                    : `₹${deliveryCharge}`}
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
                {totalAmount.toLocaleString(
                  "en-IN"
                )}

              </strong>

            </div>

            {/* =================================================
                PAYMENT
            ================================================= */}

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
                    setPaymentMethod("cod")
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
                <div className="payment-info-box">

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

            {/* =================================================
                BILLING
            ================================================= */}

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

              {billingAddress ===
                "different" && (
                <p className="checkout-note">
                  Different billing address
                  support can be added later.
                </p>
              )}

            </div>

            {/* =================================================
                PLACE ORDER
            ================================================= */}

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