import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Checkout.css";

function getCartItems() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}

function Checkout() {
  const navigate = useNavigate();

  const cartItems = getCartItems();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const delivery = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 99;

  const total = subtotal + delivery;

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const order = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-IN"),
      customer: {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
        state: formData.get("state"),
        pincode: formData.get("pincode"),
      },
      items: cartItems,
      subtotal,
      delivery,
      total,
      paymentMethod: "Cash on Delivery",
      status: "Order Placed",
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const updatedOrders = [...existingOrders, order];

    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    localStorage.removeItem("cart");

    navigate("/orders");
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <main className="checkout-page">
          <section className="checkout-heading">
            <p>CHECKOUT</p>
            <h1>YOUR CART IS EMPTY</h1>
            <span>Add some products before proceeding to checkout.</span>
          </section>

          <div className="checkout-empty">
            <Link to="/shop">CONTINUE SHOPPING</Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <section className="checkout-heading">
          <p>SECURE CHECKOUT</p>

          <h1>CHECKOUT</h1>

          <span>Complete your details to place your order.</span>
        </section>

        <div className="checkout-container">
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <div className="checkout-section">
              <div className="checkout-section-title">
                <span>01</span>
                <h2>CONTACT INFORMATION</h2>
              </div>

              <div className="form-group">
                <label htmlFor="email">EMAIL ADDRESS</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">PHONE NUMBER</label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div className="checkout-section">
              <div className="checkout-section-title">
                <span>02</span>
                <h2>SHIPPING ADDRESS</h2>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">FIRST NAME</label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">LAST NAME</label>

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
                <label htmlFor="address">ADDRESS</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="House / Street / Area"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">CITY</label>

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
                  <label htmlFor="state">STATE</label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="State"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pincode">PINCODE</label>

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

            <div className="checkout-section">
              <div className="checkout-section-title">
                <span>03</span>
                <h2>PAYMENT</h2>
              </div>

              <div className="payment-box">
                <div className="payment-option">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cod"
                    defaultChecked
                  />

                  <label htmlFor="cod">
                    <strong>CASH ON DELIVERY</strong>

                    <small>Pay when your order arrives.</small>
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="place-order-btn">
              PLACE ORDER
            </button>
          </form>

          <aside className="checkout-summary">
            <h2>ORDER SUMMARY</h2>

            <div className="checkout-products">
              {cartItems.map((item) => (
                <div
                  className="checkout-product"
                  key={`${item.id}-${item.size}`}
                >
                  <div className="checkout-product-image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="checkout-product-info">
                    <h3>{item.name}</h3>

                    <p>Size: {item.size}</p>

                    <p>Qty: {item.quantity}</p>
                  </div>

                  <strong>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-summary-divider"></div>

            <div className="checkout-summary-row">
              <span>SUBTOTAL</span>

              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="checkout-summary-row">
              <span>DELIVERY</span>

              <span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
            </div>

            <div className="checkout-summary-divider"></div>

            <div className="checkout-summary-total">
              <span>TOTAL</span>

              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>

            <Link to="/cart" className="back-to-cart">
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
