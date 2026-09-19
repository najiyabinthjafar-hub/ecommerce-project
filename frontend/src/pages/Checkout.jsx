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
  const [billingAddress, setBillingAddress] = useState("same");

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
    if (!cart) {
      return [];
    }

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

  const deliveryCharge =
    subtotal >= 999 || subtotal === 0 ? 0 : 99;

  const discount = coupon
    ? coupon.discountAmount || 0
    : 0;

  const totalAmount = Math.max(
    0,
    subtotal + deliveryCharge - discount
  );

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code.");
      setCoupon(null);
      return;
    }

    try {
      setCouponMessage("");

      const response = await axios.get(
        `${API_URL}/coupons/code/${couponCode
          .trim()
          .toUpperCase()}`,
        authConfig
      );

      const couponData =
        response.data.coupon || response.data;

      if (!couponData) {
        setCoupon(null);
        setCouponMessage("Invalid coupon.");
        return;
      }

      if (
        couponData.active === false ||
        couponData.isActive === false
      ) {
        setCoupon(null);
        setCouponMessage("This coupon is inactive.");
        return;
      }

      const expiryDate =
        couponData.expiryDate || couponData.expiry;

      if (
        expiryDate &&
        new Date(expiryDate) < new Date()
      ) {
        setCoupon(null);
        setCouponMessage("This coupon has expired.");
        return;
      }

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

      let discountAmount = 0;

      if (
        couponData.discountType === "percentage" ||
        couponData.type === "percentage"
      ) {
        discountAmount =
          (subtotal *
            Number(couponData.discountValue || 0)) /
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
          couponData.code || couponCode
        } applied successfully.`
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

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
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

      const formData = new FormData(event.currentTarget);

      const firstName =
        formData.get("firstName") || "";

      const lastName =
        formData.get("lastName") || "";

      const shippingAddress = {
        fullName: `${firstName} ${lastName}`.trim(),
        phone: formData.get("phone") || "",
        address: formData.get("address") || "",
        apartment: formData.get("apartment") || "",
        city: formData.get("city") || "",
        state: formData.get("state") || "",
        pincode: formData.get("pincode") || "",
        country: formData.get("country") || "India",
      };

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

      const orderData = {
        userId: userId,
        items: cartItems.map((item) => {
          const product = getProduct(item);

          return {
            product: product._id || product.id,
            quantity: getQuantity(item),
            price: getPrice(item),
          };
        }),
        shippingAddress: shippingAddress,
        couponCode:
          coupon?.code ||
          couponCode.trim().toUpperCase() ||
          null,
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
            <Link to="/login">LOGIN</Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

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

            <Link
              to="/"
              className="checkout-shop-btn"
            >
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
              Back to Cart
            </Link>
          </div>

          <form onSubmit={handlePlaceOrder}>
            <div className="checkout-layout">

              <div className="checkout-left">

                <section className="checkout-section">
                  <h2 className="delivery-title">
                    Delivery
                  </h2>

                  <div className="checkout-field">
                    <label>Country/region</label>

                    <select
                      name="country"
                      defaultValue="India"
                    >
                      <option value="India">
                        India
                      </option>
                    </select>
                  </div>

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

                  <div className="checkout-field">
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      required
                    />

                    <span className="field-icon">
                      Search
                    </span>
                  </div>

                  <div className="checkout-field">
                    <input
                      type="text"
                      name="apartment"
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>

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

                  <label className="save-info">
                    <input
                      type="checkbox"
                      name="saveInfo"
                    />

                    <span>
                      Save this information for next time
                    </span>
                  </label>
                </section>

                <section className="checkout-section">
                  <h2>Payment Method</h2>

                  <div className="payment-options">

                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() =>
                          setPaymentMethod("cod")
                        }
                      />

                      <div>
                        <strong>
                          Cash on Delivery
                        </strong>

                        <p>
                          Pay when your order is delivered.
                        </p>
                      </div>
                    </label>

                    <label className="payment-option disabled-payment">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        disabled
                      />

                      <div>
                        <strong>
                          Online Payment
                        </strong>

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

                <section className="checkout-section">
                  <h2>Discount code</h2>

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

                <section className="checkout-section">
                  <h2>Billing address</h2>

                  <label className="billing-option">
                    <input
                      type="radio"
                      name="billing"
                      value="same"
                      checked={billingAddress === "same"}
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
                        billingAddress === "different"
                      }
                      onChange={() =>
                        setBillingAddress("different")
                      }
                    />

                    <span>
                      Use a different billing address
                    </span>
                  </label>

                  {billingAddress === "different" && (
                    <p className="checkout-note">
                      Different billing address support
                      can be added later.
                    </p>
                  )}
                </section>

              </div>

              <div className="checkout-right">

                <section className="checkout-section">
                  <h2>Order Summary</h2>

                  <div className="order-summary-products">

                    {cartItems.map((item, index) => {
                      const product = getProduct(item);

                      const productId =
                        product._id ||
                        product.id ||
                        index;

                      const price = getPrice(item);
                      const quantity = getQuantity(item);

                      const image =
                        product.image ||
                        product.images?.[0] ||
                        item.image ||
                        "/placeholder.png";

                      return (
                        <div
                          className="figma-product"
                          key={productId}
                        >

                          <div className="figma-product-image">
                            <img
                              src={image}
                              alt={
                                product.name || "Product"
                              }
                            />

                            <span className="product-quantity">
                              {quantity}
                            </span>
                          </div>

                          <div className="figma-product-name">
                            <h4>
                              {product.name || "Product"}
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
                            ).toLocaleString("en-IN")}
                          </strong>

                        </div>
                      );
                    })}

                  </div>

                  <div className="price-row">
                    <span>Subtotal</span>

                    <span>
                      ₹
                      {subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="price-row">
                    <span>Shipping</span>

                    <span className="shipping-value">
                      {deliveryCharge === 0
                        ? "FREE"
                        : `₹${deliveryCharge}`}
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

                  <div className="figma-total">
                    <div>
                      <h2>Total</h2>

                      <small>
                        Including taxes
                      </small>
                    </div>

                    <strong>
                      <span className="currency">
                        INR
                      </span>{" "}
                      ₹
                      {totalAmount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>
                </section>

                <button
                  type="submit"
                  className="figma-pay-button"
                  disabled={placingOrder}
                >
                  {placingOrder
                    ? "PLACING ORDER..."
                    : "PLACE ORDER"}
                </button>

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

              </div>

            </div>
          </form>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Checkout;