import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import logo from "../assets/logo.png";

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

  const [paymentMethod, setPaymentMethod] = useState("upi");

  const [billingAddress, setBillingAddress] = useState("same");

  const subtotal = cartItems.reduce(

    (total, item) => total + item.price * item.quantity,

    0

  );

  const delivery =

    subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 99;

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

        apartment: formData.get("apartment"),

        city: formData.get("city"),

        state: formData.get("state"),

        pincode: formData.get("pincode"),

      },

      items: cartItems,

      subtotal,

      delivery,

      total,

      paymentMethod,

      billingAddress,

      status: "Order Placed",

    };

    const existingOrders =

      JSON.parse(localStorage.getItem("orders")) || [];

    const updatedOrders = [

      ...existingOrders,

      order,

    ];

    localStorage.setItem(

      "orders",

      JSON.stringify(updatedOrders)

    );

    localStorage.removeItem("cart");

    alert("Order placed successfully!");

    navigate("/orders");

  };

  // EMPTY CART

  if (cartItems.length === 0) {

    return (

      <>

        <main className="checkout-empty-page">

          <div className="checkout-empty-logo">

            <img src={logo} alt="Rizo" />

          </div>

          <div className="checkout-empty">

            <h2>Your cart is empty</h2>

            <button

              onClick={() => navigate("/shop")}

            >

              CONTINUE SHOPPING

            </button>

          </div>

        </main>

      </>

    );

  }

  return (

    <>

      <main className="figma-checkout">

        <form

          className="figma-checkout-container"

          onSubmit={handlePlaceOrder}

        >

          {/* LEFT SIDE - DELIVERY */}

          <section className="delivery-section">

            {/* LOGO */}

            <div className="checkout-logo">

              <img

                src={logo}

                alt="Rizo"

              />

            </div>

            {/* DELIVERY TITLE */}

            <h2 className="delivery-title">

              Delivery

            </h2>

            {/* COUNTRY / REGION */}

            <div className="checkout-field">

              <label>

                Country/region

              </label>

              <select name="country">

                <option value="India">

                  India

                </option>

              </select>

            </div>

            {/* FIRST NAME / LAST NAME */}

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

              <span className="field-icon">

                ⌕

              </span>

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

              <span className="field-icon phone-icon">

                ◷

              </span>

            </div>

            {/* SAVE INFORMATION */}

            <label className="save-info">

              <input

                type="checkbox"

                name="saveInfo"

              />

              <span>

                Save this information for next time

              </span>

            </label>

            {/* HIDDEN EMAIL */}

            <input

              type="hidden"

              name="email"

              value={

                JSON.parse(

                  localStorage.getItem("user") || "{}"

                ).email || ""

              }

              readOnly

            />

          </section>


          {/* RIGHT SIDE */}

          <section className="checkout-right">

            {/* ORDER PRODUCTS */}

            <div className="order-summary-products">

              {cartItems.map((item) => (

                <div

                  className="figma-product"

                  key={`${item.id}-${item.size}`}

                >

                  {/* PRODUCT IMAGE */}

                  <div className="figma-product-image">

                    <img

                      src={item.image}

                      alt={item.name}

                    />

                    <span className="product-quantity">

                      {item.quantity}

                    </span>

                  </div>

                  {/* PRODUCT NAME */}

                  <div className="figma-product-name">

                    <h4>

                      {item.name}

                    </h4>

                    <small>

                      {item.size &&

                        `Size: ${item.size}`}

                    </small>

                  </div>

                  {/* PRICE */}

                  <strong>

                    ₹

                    {(

                      item.price * item.quantity

                    ).toLocaleString("en-IN")}

                  </strong>

                </div>

              ))}

            </div>


            {/* DISCOUNT */}

            <div className="discount-box">

              <input

                type="text"

                placeholder="Discount code or gift card"

              />

              <button type="button">

                Apply

              </button>

            </div>


            {/* PRICE DETAILS */}

            <div className="price-details">

              <div className="price-row">

                <span>

                  Subtotal

                </span>

                <span>

                  ₹

                  {subtotal.toLocaleString("en-IN")}

                </span>

              </div>

              <div className="price-row">

                <span>

                  Shipping

                  <span className="info-icon">

                    ?

                  </span>

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

                  Including ₹

                  {(total * 0.0475).toFixed(2)}

                  {" "}in taxes

                </small>

              </div>

              <strong>

                <span className="currency">

                  INR

                </span>

                ₹

                {total.toLocaleString("en-IN")}

              </strong>

            </div>


            {/* PAYMENT */}

            <div className="payment-section">

              <h2>

                Payment

              </h2>

              <p className="payment-subtitle">

                All transactions are secure and encrypted.

              </p>


              {/* UPI */}

              <label

                className={`payment-method ${

                  paymentMethod === "upi"

                    ? "active-payment"

                    : ""

                }`}

              >

                <input

                  type="radio"

                  name="payment"

                  value="UPI"

                  checked={

                    paymentMethod === "upi"

                  }

                  onChange={() =>

                    setPaymentMethod("upi")

                  }

                />

                <div className="payment-method-content">

                  <strong>

                    PhonePe Payment Gateway

                    (UPI, Cards & NetBanking)

                  </strong>

                </div>

                <span className="payment-icons">

                  UPI&nbsp;&nbsp; VISA&nbsp;&nbsp; MC

                </span>

              </label>


              {/* UPI INFO */}

              {paymentMethod === "upi" && (

                <div className="payment-info-box">

                  <div className="payment-card-icon">

                    ▱

                  </div>

                  <p>

                    After clicking{" "}

                    <strong>“Pay now”</strong>,

                    you will be redirected to

                    PhonePe Payment Gateway

                    (UPI, Cards & NetBanking)

                    to complete your purchase

                    securely.

                  </p>

                </div>

              )}


              {/* CASH ON DELIVERY */}

              <label

                className={`payment-method ${

                  paymentMethod === "cod"

                    ? "active-payment"

                    : ""

                }`}

              >

                <input

                  type="radio"

                  name="payment"

                  value="Cash on Delivery"

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

                  ▣

                </span>

              </label>


              {/* CARD */}

              <label

                className={`payment-method ${

                  paymentMethod === "card"

                    ? "active-payment"

                    : ""

                }`}

              >

                <input

                  type="radio"

                  name="payment"

                  value="Card"

                  checked={

                    paymentMethod === "card"

                  }

                  onChange={() =>

                    setPaymentMethod("card")

                  }

                />

                <div className="payment-method-content">

                  <strong>

                    Credit / Debit Card

                  </strong>

                </div>

                <span className="payment-icons">

                  ▤

                </span>

              </label>


              {/* CARD INFO */}

              {paymentMethod === "card" && (

                <div className="payment-info-box card-info">

                  <p>

                    After clicking{" "}

                    <strong>“Pay now”</strong>,

                    you can complete your payment

                    securely using your card.

                  </p>

                </div>

              )}


              {/* COD INFO */}

              {paymentMethod === "cod" && (

                <div className="payment-info-box cod-info">

                  <p>

                    You can pay cash when your

                    order is delivered.

                  </p>

                </div>

              )}

            </div>


            {/* BILLING ADDRESS */}

            <div className="billing-section">

              <h2>

                Billing address

              </h2>

              {/* SAME ADDRESS */}

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


              {/* DIFFERENT ADDRESS */}

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

            </div>


            {/* PAY NOW */}

            <button

              type="submit"

              className="figma-pay-button"

            >

              PAY NOW

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