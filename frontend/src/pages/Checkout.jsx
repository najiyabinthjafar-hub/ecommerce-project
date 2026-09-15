import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Checkout.css";

const API_URL = "http://localhost:5000/api";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
  });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

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
      }
    } finally {
      setLoading(false);
    }
  };

  const getCartItems = () => {
    if (!cart) return [];

    return cart.items || cart.products || [];
  };

  const getProduct = (item) => {
    return item.product || item.productId || item;
  };

  const getQuantity = (item) => {
    return item.quantity || 1;
  };

  const getPrice = (item) => {
    const product = getProduct(item);

    return Number(
      product.price ||
        product.salePrice ||
        item.price ||
        0
    );
  };

  const cartItems = getCartItems();

  const subtotal = cartItems.reduce((total, item) => {
    return total + getPrice(item) * getQuantity(item);
  }, 0);

  const deliveryCharge = subtotal >= 999 || subtotal === 0 ? 0 : 99;

  const discount = coupon
    ? coupon.discountAmount || 0
    : 0;

  const totalAmount = Math.max(
    0,
    subtotal + deliveryCharge - discount
  );

  const handleAddressChange = (event) => {
    const { name, value } = event.target;

    setShippingAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code.");
      setCoupon(null);
      return;
    }

    try {
      setCouponMessage("");

      const response = await axios.get(
        `${API_URL}/coupons/code/${couponCode.trim().toUpperCase()}`,
        authConfig
      );

      const couponData = response.data.coupon || response.data;

      if (!couponData) {
        setCoupon(null);
        setCouponMessage("Invalid coupon.");
        return;
      }

      if (couponData.active === false) {
        setCoupon(null);
        setCouponMessage("This coupon is inactive.");
        return;
      }

      if (
        couponData.expiryDate &&
        new Date(couponData.expiryDate) < new Date()
      ) {
        setCoupon(null);
        setCouponMessage("This coupon has expired.");
        return;
      }

      const minimumPurchase =
        Number(couponData.minimumPurchase || 0);

      if (subtotal < minimumPurchase) {
        setCoupon(null);
        setCouponMessage(
          `Minimum purchase should be ₹${minimumPurchase}.`
        );
        return;
      }

      let discountAmount = 0;

      if (
        couponData.discountType === "percentage" ||
        couponData.type === "percentage"
      ) {
        discountAmount =
          (subtotal * Number(couponData.discountValue || 0)) /
          100;
      } else {
        discountAmount = Number(
          couponData.discountValue ||
            couponData.discount ||
            0
        );
      }

      if (couponData.maxDiscount) {
        discountAmount = Math.min(
          discountAmount,
          Number(couponData.maxDiscount)
        );
      }

      setCoupon({
        ...couponData,
        discountAmount,
      });

      setCouponMessage(
        `Coupon ${couponData.code} applied successfully.`
      );
    } catch (error) {
      console.error("Coupon error:", error);

      setCoupon(null);

      setCouponMessage(
        error.response?.data?.message ||
          "Invalid coupon code."
      );
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponMessage("");
  };

  const validateAddress = () => {
    const requiredFields = [
      "fullName",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    for (const field of requiredFields) {
      if (!shippingAddress[field].trim()) {
        alert(`Please enter ${field}.`);
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!validateAddress()) {
      return;
    }

    /*
      Currently COD is the functional payment method.
      Razorpay integration will be added separately.
    */
    if (paymentMethod !== "cod") {
      alert(
        "Online payment is not available yet. Please select Cash on Delivery."
      );
      return;
    }

    try {
      setPlacingOrder(true);

      const orderData = {
        userId,
        items: cartItems.map((item) => {
          const product = getProduct(item);

          return {
            product: product._id || product.id,
            quantity: getQuantity(item),
            price: getPrice(item),
          };
        }),
        shippingAddress,
        couponCode: coupon?.code || null,
        paymentMethod: "COD",
      };

      console.log("Checkout request:", orderData);

      const response = await axios.post(
        `${API_URL}/checkout`,
        orderData,
        authConfig
      );

      console.log("Checkout response:", response.data);

      alert("Order placed successfully!");

      await fetchCart();

      navigate("/orders");
    } catch (error) {
      console.error("Checkout error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="checkout-page">
          <div className="checkout-loading">
            Loading checkout...
          </div>
        </div>

        <Footer />
      </>
    );
  }

  if (!cart || cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <div className="checkout-page">
          <div className="empty-checkout">
            <h2>Your cart is empty</h2>

            <p>
              Add some products to your cart before checkout.
            </p>

            <Link to="/" className="checkout-shop-btn">
              Continue Shopping
            </Link>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <div className="checkout-container">

          <div className="checkout-header">
            <h1>Checkout</h1>

            <Link to="/cart">
              ← Back to Cart
            </Link>
          </div>

          <div className="checkout-layout">

            {/* LEFT SIDE */}

            <div className="checkout-left">

              <section className="checkout-section">
                <h2>Shipping Address</h2>

                <div className="address-form">

                  <div className="form-row">

                    <div className="form-group">
                      <label>Full Name</label>

                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleAddressChange}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone</label>

                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleAddressChange}
                        placeholder="Enter phone number"
                      />
                    </div>

                  </div>

                  <div className="form-group">
                    <label>Address</label>

                    <input
                      type="text"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleAddressChange}
                      placeholder="House number, street, area"
                    />
                  </div>

                  <div className="form-group">
                    <label>Apartment / Landmark</label>

                    <input
                      type="text"
                      name="apartment"
                      value={shippingAddress.apartment}
                      onChange={handleAddressChange}
                      placeholder="Apartment, landmark (optional)"
                    />
                  </div>

                  <div className="form-row">

                    <div className="form-group">
                      <label>City</label>

                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        placeholder="City"
                      />
                    </div>

                    <div className="form-group">
                      <label>State</label>

                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        placeholder="State"
                      />
                    </div>

                  </div>

                  <div className="form-group">
                    <label>Pincode</label>

                    <input
                      type="text"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleAddressChange}
                      placeholder="Pincode"
                    />
                  </div>

                </div>
              </section>

              {/* PAYMENT */}

              <section className="checkout-section">
                <h2>Payment Method</h2>

                <div className="payment-options">

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(event) =>
                        setPaymentMethod(event.target.value)
                      }
                    />

                    <div>
                      <strong>Cash on Delivery</strong>

                      <p>
                        Pay when your order is delivered.
                      </p>
                    </div>
                  </label>

                  <label className="payment-option disabled-payment">
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={(event) =>
                        setPaymentMethod(event.target.value)
                      }
                    />

                    <div>
                      <strong>Online Payment</strong>

                      <p>
                        UPI / Card / Net Banking
                      </p>

                      <small>
                        Razorpay integration coming soon
                      </small>
                    </div>
                  </label>

                </div>
              </section>

              {/* COUPON */}

              <section className="checkout-section">
                <h2>Coupon</h2>

                <div className="coupon-box">

                  <input
                    type="text"
                    value={couponCode}
                    onChange={(event) =>
                      setCouponCode(event.target.value)
                    }
                    placeholder="Enter coupon code"
                    disabled={!!coupon}
                  />

                  {!coupon ? (
                    <button
                      type="button"
                      onClick={validateCoupon}
                    >
                      Apply
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

              </section>

            </div>

            {/* RIGHT SIDE */}

            <div className="checkout-right">

              <section className="order-summary">

                <h2>Order Summary</h2>

                <div className="summary-items">

                  {cartItems.map((item, index) => {
                    const product = getProduct(item);
                    const quantity = getQuantity(item);
                    const price = getPrice(item);

                    return (
                      <div
                        className="summary-item"
                        key={
                          product._id ||
                          product.id ||
                          index
                        }
                      >

                        <div className="summary-product">

                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name || "Product"}
                            />
                          )}

                          <div>
                            <h4>
                              {product.name ||
                                "Product"}
                            </h4>

                            <p>
                              Qty: {quantity}
                            </p>
                          </div>

                        </div>

                        <span>
                          ₹
                          {(price * quantity).toFixed(2)}
                        </span>

                      </div>
                    );
                  })}

                </div>

                <div className="summary-line">
                  <span>Subtotal</span>

                  <span>
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="summary-line">
                  <span>Delivery</span>

                  <span>
                    {deliveryCharge === 0
                      ? "FREE"
                      : `₹${deliveryCharge.toFixed(2)}`}
                  </span>
                </div>

                {coupon && (
                  <div className="summary-line discount-line">
                    <span>Discount</span>

                    <span>
                      -₹{discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="summary-total">
                  <span>Total</span>

                  <strong>
                    ₹{totalAmount.toFixed(2)}
                  </strong>
                </div>

                <button
                  type="button"
                  className="place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                >
                  {placingOrder
                    ? "PLACING ORDER..."
                    : "PLACE ORDER"}
                </button>

                <p className="checkout-note">
                  By placing your order, you agree to our
                  terms and conditions.
                </p>

              </section>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Checkout;