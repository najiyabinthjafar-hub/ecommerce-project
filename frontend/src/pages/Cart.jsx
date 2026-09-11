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
      (item) => !(item.id === id && item.size === size)
    );

    saveCart(updatedCart);
    window.location.reload();
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const delivery =
    subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 99;

  const total = subtotal + delivery;

  return (
    <>
      <Navbar />

      <main className="cart-page">
        <div className="cart-wrapper">

          {/* CART TOP */}
          <div className="cart-top">
            <h1>Your cart</h1>

            <Link to="/shop" className="continue-shopping">
              Continue shopping
            </Link>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>

              <p>
                Looks like you haven't added anything yet.
              </p>

              
            </div>
          ) : (
            <>
              {/* TABLE HEADER */}
              <div className="cart-header">
                <span>PRODUCT</span>

                <span>QUANTITY</span>

                <span>TOTAL</span>
              </div>

              {/* PRODUCTS */}
              <div className="cart-products">
                {cartItems.map((item) => (
                  <div
                    className="cart-item"
                    key={`${item.id}-${item.size}`}
                  >
                    {/* PRODUCT */}
                    <div className="cart-product">
                      <div className="cart-product-image">
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      </div>

                      <div className="cart-product-info">
                        <h3>{item.name}</h3>

                        <p>₹{item.price.toLocaleString("en-IN")}</p>

                        <p>Size: {item.size}</p>
                      </div>
                    </div>

                    {/* QUANTITY */}
                    <div className="cart-quantity-area">
                      <div className="cart-quantity">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              item.id,
                              item.size
                            )
                          }
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
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

                      <button
                        className="remove-btn"
                        type="button"
                        onClick={() =>
                          removeItem(
                            item.id,
                            item.size
                          )
                        }
                        aria-label="Remove item"
                      >
                        🗑
                      </button>
                    </div>

                    {/* TOTAL */}
                    <p className="cart-total">
                      ₹
                      {(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* BOTTOM AREA */}
              <div className="cart-bottom">

                <aside className="cart-summary">

                  <div className="summary-total">
                    <span>Estimated total</span>

                    <strong>
                      ₹{total.toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <p className="summary-note">
                    Taxes included. Discounts and shipping
                    calculated at checkout.
                  </p>

                  <Link
                    to="/checkout"
                    className="checkout-btn"
                  >
                    Check Out
                  </Link>

                </aside>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Cart;