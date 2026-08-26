import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "./OrderDetails.css";

function OrderDetails() {
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="order-details-page">
        <div className="order-details-header">
          <div>
            <h1>Order Details</h1>
            <p>View complete information about this order</p>
          </div>

          <button
            className="back-orders-btn"
            onClick={() => navigate("/admin/orders")}
          >
            ← Back to Orders
          </button>
        </div>

        
        <div className="order-summary">
          <div>
            <span>Order ID</span>
            <strong>#ORD001</strong>
          </div>

          <div>
            <span>Order Date</span>
            <strong>Aug 25, 2026</strong>
          </div>

          <div>
            <span>Payment Status</span>
            <strong className="paid">Paid</strong>
          </div>

          <div>
            <span>Order Status</span>
            <strong className="pending">Pending</strong>
          </div>
        </div>

        
        <div className="details-grid">
          <div className="details-card">
            <h2>Customer Details</h2>

            <p>
              <span>Name</span>
              Aisha
            </p>

            <p>
              <span>Email</span>
              aisha@example.com
            </p>

            <p>
              <span>Phone</span>
              +91 98765 43210
            </p>
          </div>

          <div className="details-card">
            <h2>Shipping Address</h2>

            <p>
              Aisha
              <br />
              12 Main Street
              <br />
              Kozhikode, Kerala
              <br />
              673001
            </p>
          </div>
        </div>

        
        <div className="products-card">
          <h2>Ordered Products</h2>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Classic T-Shirt</td>
                <td>2</td>
                <td>₹499</td>
                <td>₹998</td>
              </tr>

              <tr>
                <td>Denim Jeans</td>
                <td>1</td>
                <td>₹1,299</td>
                <td>₹1,299</td>
              </tr>
            </tbody>
          </table>

          <div className="order-total-section">
            <span>Subtotal</span>
            <strong>₹2,297</strong>

            <span>Shipping</span>
            <strong>₹100</strong>

            <span className="grand-total">Grand Total</span>
            <strong className="grand-total">₹2,397</strong>
          </div>
        </div>

        
        <div className="status-card">
          <h2>Update Order Status</h2>

          <select defaultValue="Pending">
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>

          <button className="update-status-btn">
            Update Status
          </button>
        </div>
      </main>
    </div>
  );
}

export default OrderDetails;