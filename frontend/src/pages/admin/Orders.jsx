import "./Orders.css";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useNavigate } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();

  const orders = [
    {
      id: "ORD001",
      customer: "Aisha",
      date: "Aug 25, 2026",
      items: 2,
      total: "₹1,299",
      status: "Pending",
    },
    {
      id: "ORD002",
      customer: "Fathima",
      date: "Aug 24, 2026",
      items: 3,
      total: "₹2,499",
      status: "Delivered",
    },
    {
      id: "ORD003",
      customer: "Sara",
      date: "Aug 24, 2026",
      items: 1,
      total: "₹799",
      status: "Processing",
    },
    {
      id: "ORD004",
      customer: "Niya",
      date: "Aug 23, 2026",
      items: 4,
      total: "₹3,199",
      status: "Cancelled",
    },
    {
      id: "ORD005",
      customer: "Hiba",
      date: "Aug 22, 2026",
      items: 2,
      total: "₹1,899",
      status: "Delivered",
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="orders-content">
        <div className="orders-header">
          <div>
            <h1>Orders</h1>
            <p>Manage and track customer orders</p>
          </div>
        </div>

       
        <div className="order-cards">
          <div className="order-card">
            <span>Pending Orders</span>
            <h2>12</h2>
          </div>

          <div className="order-card">
            <span>Processing</span>
            <h2>8</h2>
          </div>

          <div className="order-card">
            <span>Delivered</span>
            <h2>35</h2>
          </div>

          <div className="order-card">
            <span>Cancelled</span>
            <h2>4</h2>
          </div>
        </div>

        
        <div className="orders-tools">
          <input
            type="text"
            placeholder="Search by order ID or customer..."
          />

          <select>
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>

        
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.items}</td>
                  <td className="order-total">{order.total}</td>

                  <td>
                    <span
                      className={`status ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/admin/orders/${order.id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Orders;