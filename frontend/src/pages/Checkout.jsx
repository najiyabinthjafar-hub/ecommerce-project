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
  // LOAD RAZORPAY SCRIPT
  // =========================================================

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
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

  const subtotal = cartItems.reduce((total, item) => {
    return total + getPrice(item) * getQuantity(item);
  }, 0);

  const deliveryCharge =
    subtotal === 0 ? 0 : subtotal < 699 ? 50 : 0;

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
        response.data.coupon || response.data;

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
        setCouponMessage("This coupon is inactive.");
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
        setCouponMessage("This coupon has expired.");
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

  // =========================================================
  // REMOVE COUPON
  // =========================================================

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponMessage("");
  };

  // =========================================================
  // CREATE ORDER DATA
  // =========================================================

  const getOrderData = (form) => {
    const formData = new FormData(form);

    // =======================================================
    // SHIPPING ADDRESS
    // =======================================================

    const firstName =
      formData.get("firstName") || "";

    const lastName =
      formData.get("lastName") || "";

    const shippingAddressData = {
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
        formData.get("country") || "India",
    };

    // =======================================================
    // VALIDATION
    // =======================================================

    if (!shippingAddressData.fullName) {
      throw new Error("Please enter your name.");
    }

    if (!shippingAddressData.phone) {
      throw new Error(
        "Please enter your phone number."
      );
    }

    if (!shippingAddressData.address) {
      throw new Error(
        "Please enter your address."
      );
    }

    if (!shippingAddressData.city) {
      throw new Error(
        "Please enter your city."
      );
    }

    if (!shippingAddressData.state) {
      throw new Error(
        "Please select your state."
      );
    }

    if (!shippingAddressData.pincode) {
      throw new Error(
        "Please enter your pincode."
      );
    }

    // =======================================================
    // ORDER ITEMS
    // =======================================================

    const orderItems = cartItems.map((item) => {
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
    });

    // =======================================================
    // ORDER DATA
    // =======================================================

    return {
      user: userId,

      items: orderItems,

      shippingAddress:
        shippingAddressData,

      totalAmount: subtotal,

      discountAmount: discount,

      finalAmount: totalAmount,

      couponCode:
        coupon?.code ||
        couponCode.trim().toUpperCase() ||
        null,

      paymentMethod:
        paymentMethod === "razorpay"
          ? "RAZORPAY"
          : "COD",
    };
  };

  // =========================================================
  // RAZORPAY PAYMENT
  // =========================================================

  const handleRazorpayPayment = async (form) => {
    try {
      setPlacingOrder(true);
      setError("");

      // Load Razorpay
      const razorpayLoaded =
        await loadRazorpayScript();

      if (!razorpayLoaded) {
        throw new Error(
          "Razorpay SDK failed to load. Please check your internet connection."
        );
      }

      // Prepare order data
      const orderData =
        getOrderData(form);

      console.log(
        "RAZORPAY ORDER DATA:",
        orderData
      );

      // =====================================================
      // STEP 1: CREATE MONGODB ORDER
      // =====================================================

      const mongoOrderResponse =
        await axios.post(
          `${API_URL}/orders`,
          orderData,
          authConfig
        );

      console.log(
        "MONGODB ORDER RESPONSE:",
        mongoOrderResponse.data
      );

      const mongoOrder =
        mongoOrderResponse.data.order;

      if (!mongoOrder?._id) {
        throw new Error(
          "MongoDB order was not created."
        );
      }

      const mongoOrderId =
        mongoOrder._id;

      // =====================================================
      // STEP 2: CREATE RAZORPAY ORDER
      // =====================================================

      const razorpayOrderResponse =
        await axios.post(
          `${API_URL}/orders/razorpay/create-order`,
          {
            amount: totalAmount,
            orderId: mongoOrderId,
          },
          authConfig
        );

      console.log(
        "RAZORPAY ORDER RESPONSE:",
        razorpayOrderResponse.data
      );

      const razorpayOrder =
        razorpayOrderResponse.data.order;

      if (!razorpayOrder?.id) {
        throw new Error(
          "Razorpay order was not created."
        );
      }

      // =====================================================
      // STEP 3: GET RAZORPAY KEY
      // =====================================================

      const razorpayKey =
        import.meta.env
          .VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error(
          "Razorpay Key ID is missing. Add VITE_RAZORPAY_KEY_ID to frontend .env file."
        );
      }

      // =====================================================
      // STEP 4: OPEN RAZORPAY CHECKOUT
      // =====================================================

      const options = {
        key: razorpayKey,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency || "INR",

        name: "Rizo",

        description:
          "Rizo E-commerce Order",

        order_id:
          razorpayOrder.id,

        handler: async function (
          razorpayResponse
        ) {
          try {
            console.log(
              "RAZORPAY SUCCESS RESPONSE:",
              razorpayResponse
            );

            // =================================================
            // STEP 5: VERIFY PAYMENT
            // =================================================

            const verifyResponse =
              await axios.post(
                `${API_URL}/orders/razorpay/verify`,
                {
                  orderId:
                    mongoOrderId,

                  razorpay_order_id:
                    razorpayResponse.razorpay_order_id,

                  razorpay_payment_id:
                    razorpayResponse.razorpay_payment_id,

                  razorpay_signature:
                    razorpayResponse.razorpay_signature,
                },
                authConfig
              );

            console.log(
              "PAYMENT VERIFICATION RESPONSE:",
              verifyResponse.data
            );

            if (
              verifyResponse.data.success
            ) {
              alert(
                "Payment successful! Order placed successfully."
              );

              if (!isBuyNow) {
                await fetchCart();
              }

              navigate("/orders");
            } else {
              setError(
                "Payment verification failed."
              );
            }
          } catch (error) {
            console.error(
              "PAYMENT VERIFICATION ERROR:",
              error.response?.data ||
                error.message
            );

            setError(
              error.response?.data?.message ||
                error.response?.data?.error ||
                "Payment verification failed."
            );
          } finally {
            setPlacingOrder(false);
          }
        },

        prefill: {
          name:
            orderData.shippingAddress
              .fullName,

          contact:
            orderData.shippingAddress
              .phone,
        },

        notes: {
          orderId:
            mongoOrderId,
        },

        theme: {
          color: "#202020",
        },

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay payment popup closed."
            );

            setPlacingOrder(false);

            setError(
              "Payment was cancelled."
            );
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "RAZORPAY PAYMENT FAILED:",
            response
          );

          setPlacingOrder(false);

          setError(
            response.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "RAZORPAY ERROR:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to start Razorpay payment."
      );

      setPlacingOrder(false);
    }
  };

  // =========================================================
  // PLACE ORDER
  // =========================================================

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

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

    // =======================================================
    // RAZORPAY
    // =======================================================

    if (paymentMethod === "razorpay") {
      await handleRazorpayPayment(form);
      return;
    }

    // =======================================================
    // COD
    // =======================================================

    if (paymentMethod !== "cod") {
      alert(
        "Online payment is not available yet. Please select Cash on Delivery."
      );
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const orderData =
        getOrderData(form);

      console.log(
        "COD ORDER DATA:",
        orderData
      );

      // =====================================================
      // CREATE COD ORDER
      // =====================================================

      const response =
        await axios.post(
          `${API_URL}/orders`,
          orderData,
          authConfig
        );

      console.log(
        "COD ORDER SUCCESS:",
        response.data
      );

      alert(
        "Order placed successfully!"
      );

      if (!isBuyNow) {
          setCart(null);
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
          error.message ||
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
            <h2>
              Login Required
            </h2>

            <p>
              Please login before
              proceeding to checkout.
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

        {/* ERROR */}
        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        {/* CHECKOUT CARD */}
        <form
          className="figma-checkout-container"
          onSubmit={handlePlaceOrder}
        >

          {/* =================================================
              LEFT SIDE
              ================================================= */}

          <section className="delivery-section">

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
                  paymentMethod === "razorpay"
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
                    You will be redirected to
                    Razorpay secure payment
                    checkout.
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
                    billingAddress === "same"
                  }
                  onChange={() =>
                    setBillingAddress("same")
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

            {/* PLACE ORDER */}
            <button
              type="submit"
              className="figma-pay-button"
              disabled={placingOrder}
            >
              {placingOrder
                ? "PROCESSING..."
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

        {/* =====================================================
            BACK BUTTON — BELOW CARD + CENTER
            ===================================================== */}

        <button
          type="button"
          className="checkout-back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ← Back
        </button>

      </main>

      <Footer />
    </>
  );
}

export default Checkout;





