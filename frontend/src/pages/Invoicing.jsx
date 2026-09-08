import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Invoicing.css";

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem("orders")) || [];
  } catch {
    return [];
  }
}

function Invoicing() {
  const orders = getOrders();

  return (
    <>
      <Navbar />

      <main className="invoice-page">
        {/* HEADING */}

        <section className="invoice-heading">
          <p>RIZO ACCOUNT</p>

          <h1>INVOICES</h1>

          <span>
            View your order invoices and billing details.
          </span>
        </section>

        {orders.length === 0 ? (
          <section className="invoice-empty">
            <h2>No invoices available</h2>

            <p>
              Your invoices will appear here after you place an order.
            </p>

            <Link to="/shop" className="invoice-shop-btn">
              START SHOPPING
            </Link>
          </section>
        ) : (
          <section className="invoice-container">
            {orders
              .slice()
              .reverse()
              .map((order) => (
                <article
                  className="invoice-card"
                  key={order.id}
                >
                  <div className="invoice-card-top">
                    <div>
                      <span>INVOICE</span>
                      <h2>#{order.id}</h2>
                    </div>

                    <div className="invoice-status">
                      <span>STATUS</span>
                      <strong>{order.status}</strong>
                    </div>
                  </div>

                  <div className="invoice-details">
                    <div>
                      <span>ORDER DATE</span>
                      <strong>{order.date}</strong>
                    </div>

                    <div>
                      <span>PAYMENT</span>
                      <strong>{order.paymentMethod}</strong>
                    </div>

                    <div>
                      <span>TOTAL</span>
                      <strong>
                        ₹{order.total.toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  <div className="invoice-products">
                    <h3>ORDER ITEMS</h3>

                    {order.items.map((item) => (
                      <div
                        className="invoice-product"
                        key={`${order.id}-${item.id}-${item.size}`}
                      >
                        <div className="invoice-product-left">
                          <img
                            src={item.image}
                            alt={item.name}
                          />

                          <div>
                            <h4>{item.name}</h4>

                            <p>
                              Size: {item.size}
                            </p>

                            <p>
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <strong>
                          ₹
                          {(
                            item.price * item.quantity
                          ).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="invoice-footer">
                    <div>
                      <span>SUBTOTAL</span>

                      <strong>
                        ₹{order.subtotal.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div>
                      <span>DELIVERY</span>

                      <strong>
                        {order.delivery === 0
                          ? "FREE"
                          : `₹${order.delivery}`}
                      </strong>
                    </div>

                    <div className="invoice-grand-total">
                      <span>TOTAL AMOUNT</span>

                      <strong>
                        ₹{order.total.toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Invoicing;