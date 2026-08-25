import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="admin-dashboard">

      <aside className="sidebar">
        <h2>Rizo</h2>

        <nav>
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/products">Products</a>
          <a href="/admin/categories">Categories</a>
          <a href="#">Orders</a>
          <a href="#">Customers</a>
        </nav>

        <button className="logout">Logout</button>
      </aside>

      <main className="dashboard-content">

        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Admin 👋</p>
          </div>

          <button className="profile">Nusri</button>
        </header>

        <section className="stats">

          <div className="card">
            <h3>Total Products</h3>
            <h2>120</h2>
            <p>Products available</p>
          </div>

          <div className="card">
            <h3>Total Orders</h3>
            <h2>85</h2>
            <p>Orders received</p>
          </div>

          <div className="card">
            <h3>Total Customers</h3>
            <h2>250</h2>
            <p>Registered customers</p>
          </div>

          <div className="card">
            <h3>Total Sales</h3>
            <h2>₹75,000</h2>
            <p>This month</p>
          </div>

        </section>

        <section className="dashboard-box">
          <h2>Recent Orders</h2>

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