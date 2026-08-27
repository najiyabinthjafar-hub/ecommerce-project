import AdminSidebar from "../../components/admin/AdminSidebar";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="admin-dashboard">

    
      <AdminSidebar />

     
      <main className="dashboard-content">

        
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Admin 👋</p>
          </div>

          <button className="profile">Admin</button>
        </header>

       
        <section className="stats">

            <div className="card products-card">
  <div className="card-icon">
    <i className="bi bi-box-seam"></i>
  </div>
  <h3>Total Products</h3>
  <h2>120</h2>
  <p>Products available</p>
</div>

<div className="card orders-card">
  <div className="card-icon">
    <i className="bi bi-cart3"></i>
  </div>
  <h3>Total Orders</h3>
  <h2>85</h2>
  <p>Orders received</p>
</div>

<div className="card customers-card">
  <div className="card-icon">
    <i className="bi bi-people"></i>
  </div>
  <h3>Total Customers</h3>
  <h2>250</h2>
  <p>Registered customers</p>
</div>

<div className="card sales-card">
  <div className="card-icon">
    <i className="bi bi-currency-rupee"></i>
  </div>
  <h3>Total Sales</h3>
  <h2>₹75,000</h2>
  <p>This month</p>
</div>
        </section>

       
        <section className="dashboard-box">
          <h2>Recent Orders</h2>
          <i className="bi bi-cart3"></i>

          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>#1001</td>
                <td>Customer 1</td>
                <td>₹1,499</td>
                <td>Delivered</td>
              </tr>

              <tr>
                <td>#1002</td>
                <td>Customer 2</td>
                <td>₹899</td>
                <td>Pending</td>
              </tr>

              <tr>
                <td>#1003</td>
                <td>Customer 3</td>
                <td>₹2,199</td>
                <td>Processing</td>
              </tr>
            </tbody>
          </table>
        </section>

      </main>

    </div>
  );
}

export default Dashboard;