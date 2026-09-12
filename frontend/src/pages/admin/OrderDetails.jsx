import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./OrderDetails.css";

function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // UI demo data
  const order = {
    id: id || "ORD-1001",
    date: "02 Sep 2026",
    status: "Delivered",
    customer: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    address: "Kochi, Kerala, India",
    payment: "Paid",
    method: "Razorpay",
    items: [
      {
        id: 1,
        name: "Premium T-Shirt",
        category: "Men",
        quantity: 2,
        price: 799,
      },
      {
        id: 2,
        name: "Classic Sneakers",
        category: "Footwear",
        quantity: 1,
        price: 1499,
      },
    ],
  };

  const subtotal = order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = 50;
  const total = subtotal + shipping;

  return (
    <div className="order-details-page">
      {/* Page Header */}
      <div className="order-details-header">
        <div>
          <button
            className="back-btn"
            onClick={() => navigate("/admin/orders")}
          >
            ← Back to Orders
          </button>

          <div className="title-row">
            <div>
              <h1>Order Details</h1>
              <p>View complete information about this order.</p>
            </div>

            <span className="order-status">{order.status}</span>
          </div>
        </div>
      </div>

      {/* Order Overview */}
      <div className="order-overview">
        <div className="overview-item">
          <span>Order ID</span>
          <strong>#{order.id}</strong>
        </div>

        <div className="overview-item">
          <span>Order Date</span>
          <strong>{order.date}</strong>
        </div>

        <div className="overview-item">
          <span>Payment</span>
          <strong className="paid">{order.payment}</strong>
        </div>

        <div className="overview-item">
          <span>Payment Method</span>
          <strong>{order.method}</strong>
        </div>
      </div>

      {/* Main Grid */}
      <div className="order-details-grid">
        {/* Customer Details */}
        <div className="details-card customer-card">
          <div className="card-heading">
            <div className="heading-icon">
              <i className="bi bi-person"></i>
            </div>

            <div>
              <h2>Customer Details</h2>
              <p>Customer information</p>
            </div>
          </div>

          <div className="customer-info">
            <div>
              <span>Name</span>
              <strong>{order.customer}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{order.email}</strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>{order.phone}</strong>
            </div>

            <div>
              <span>Shipping Address</span>
              <strong>{order.address}</strong>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="details-card payment-card">
          <div className="card-heading">
            <div className="heading-icon payment-icon">
              <i className="bi bi-credit-card"></i>
            </div>

            <div>
              <h2>Payment Details</h2>
              <p>Transaction information</p>
            </div>
          </div>

          <div className="payment-info">
            <div>
              <span>Payment Status</span>
              <strong className="paid">Paid</strong>
            </div>

            <div>
              <span>Method</span>
              <strong>{order.method}</strong>
            </div>

            <div>
              <span>Shipping</span>
              <strong>Standard Delivery</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="details-card products-card">
        <div className="products-card-header">
          <div>
            <h2>Ordered Products</h2>
            <p>{order.items.length} items in this order</p>
          </div>
        </div>

        <div className="order-table-wrapper">
          <table className="order-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="product-name">
                      <div className="product-image">
                        <i className="bi bi-box"></i>
                      </div>

                      <strong>{item.name}</strong>
                    </div>
                  </td>

                  <td>{item.category}</td>

                  <td>₹{item.price}</td>

                  <td>{item.quantity}</td>

                  <td>
                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="order-bottom-grid">
        {/* Order Timeline */}
        <div className="details-card timeline-card">
          <div className="card-heading">
            <div className="heading-icon">
              <i className="bi bi-clock-history"></i>
            </div>

            <div>
              <h2>Order Status</h2>
              <p>Order progress</p>
            </div>
          </div>

          <div className="timeline">
            <div className="timeline-item completed">
              <div className="timeline-dot">
                <i className="bi bi-check"></i>
              </div>

              <div>
                <strong>Order Placed</strong>
                <span>Order has been placed successfully.</span>
              </div>
            </div>

            <div className="timeline-item completed">
              <div className="timeline-dot">
                <i className="bi bi-check"></i>
              </div>

              <div>
                <strong>Processing</strong>
                <span>Order is being prepared.</span>
              </div>
            </div>

            <div className="timeline-item completed">
              <div className="timeline-dot">
                <i className="bi bi-check"></i>
              </div>

              <div>
                <strong>Shipped</strong>
                <span>Package has been shipped.</span>
              </div>
            </div>

            <div className="timeline-item completed">
              <div className="timeline-dot">
                <i className="bi bi-check"></i>
              </div>

              <div>
                <strong>Delivered</strong>
                <span>Order delivered to customer.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="details-card summary-card">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{subtotal}</strong>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <strong>₹{shipping}</strong>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total Amount</span>
            <strong>₹{total}</strong>
          </div>

          <button
            className="orders-btn"
            onClick={() => navigate("/admin/orders")}
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;