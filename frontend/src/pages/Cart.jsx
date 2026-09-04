import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Cart.css";

function getCartItems() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function Cart() {
  const cartItems = getCartItems();

  const increaseQuantity = (id, size) => {
    const cart = getCartItems();

    const updatedCart = cart.map((item) =>
      item.id === id && item.size === size
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    saveCart(updatedCart);

    window.location.reload();
  };

  const decreaseQuantity = (id, size) => {
    const cart = getCartItems();

    const updatedCart = cart
      .map((item) =>
        item.id === id && item.size === size
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);

    window.location.reload();
  };

  const removeItem = (id, size) => {
    const cart = getCartItems();

    const updatedCart = cart.filter(
      (item) =>
        !(item.id === id && item.size === size)
    );

    saveCart(updatedCart);

    window.location.reload();
  };

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const delivery =
    subtotal === 0
      ? 0
      : subtotal >= 999
      ? 0
      : 99;

  const total = subtotal + delivery;

  return (
    <>
      <Navbar />

      <main className="cart-page">

        <section className="cart-heading">
          <p>YOUR BAG</p>

          <h1>SHOPPING CART</h1>

          <span>
            Review your selected items before checkout.
          </span>
        </section>

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
              ← CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <section className="cart-container">

            <div className="cart-items">

              <div className="cart-items-header">
                <span>PRODUCT</span>
                <span>PRICE</span>
                <span>QUANTITY</span>
                <span>TOTAL</span>
              </div>

              {cartItems.map((item) => (
                <div
                  className="cart-item"
                  key={`${item.id}-${item.size}`}
                >

                  <div className="cart-product">

                    <div className="cart-product-image">
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    </div>

                    <div className="cart-product-info">
                      <h3>{item.name}</h3>

                      <p>
                        Size: {item.size}
                      </p>

                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeItem(
                            item.id,
                            item.size
                          )
                        }
                      >
                        REMOVE
                      </button>
                    </div>

                  </div>

                  <p className="cart-price">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  <div className="cart-quantity">

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id,
                          item.size
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id,
                          item.size
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <p className="cart-total">
                    ₹
                    {(
                      item.price * item.quantity
                    ).toLocaleString("en-IN")}
                  </p>

                </div>
              ))}

              <Link
                to="/shop"
                className="continue-shopping"
              >
                ← CONTINUE SHOPPING
              </Link>

            </div>

            <aside className="cart-summary">

              <h2>ORDER SUMMARY</h2>

              <div className="summary-row">
                <span>SUBTOTAL</span>

                <span>
                  ₹{subtotal.toLocaleString("en-IN")}
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
                  ₹{total.toLocaleString("en-IN")}
                </strong>
              </div>

              <Link
                to="/checkout"
                className="checkout-btn"
              >
                PROCEED TO CHECKOUT
              </Link>

            </aside>

          </section>
        )}

      </main>

      <Footer />
    </>
  );
}

export default Cart;

