import AdminSidebar from "../../components/admin/AdminSidebar";
import "./Customers.css";

function Customers() {
  const customers = [
    {
      id: 1,
      name: "Aisha",
      email: "aisha@example.com",
      phone: "+91 98765 43210",
      orders: 5,
      status: "Active",
    },
    {
      id: 2,
      name: "Fathima",
      email: "fathima@example.com",
      phone: "+91 98765 12345",
      orders: 8,
      status: "Active",
    },
    {
      id: 3,
      name: "Sara",
      email: "sara@example.com",
      phone: "+91 98765 67890",
      orders: 3,
      status: "Active",
    },
    {
      id: 4,
      name: "Niya",
      email: "niya@example.com",
      phone: "+91 98765 11111",
      orders: 1,
      status: "Blocked",
    },
  ];

  return (
    <div className="customers-layout">
      <AdminSidebar />

      <main className="customers-main">
        <div className="customers-content">

          
          <div className="customers-header">
            <div>
              <h1>Customers</h1>
              <p>Manage your store customers</p>
            </div>
          </div>

         
          <div className="customer-stats">

            <div className="customer-stat-card">
              <span>Total Customers</span>
              <strong>250</strong>
            </div>

            <div className="customer-stat-card">
              <span>Active Customers</span>
              <strong>238</strong>
            </div>

            <div className="customer-stat-card">
              <span>New Customers</span>
              <strong>18</strong>
            </div>

            <div className="customer-stat-card">
              <span>Blocked</span>
              <strong>12</strong>
            </div>

          </div>

         
          <div className="customers-card">

            <div className="customers-card-header">
              <div>
                <h2>All Customers</h2>
                <p>View and manage registered customers</p>
              </div>

              <input
                type="text"
                placeholder="Search customers..."
                className="customer-search"
              />
            </div>

            
            <div className="customers-table-container">
              <table className="customers-table">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Orders</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer, index) => (
                    <tr key={customer.id}>

                      <td>{index + 1}</td>

                      <td>
                        <div className="customer-name">
                          {customer.name}
                        </div>
                      </td>

                      <td>{customer.email}</td>

                      <td>{customer.phone}</td>

                      <td>{customer.orders}</td>

                      <td>
                        <span
                          className={`customer-status ${customer.status.toLowerCase()}`}
                        >
                          {customer.status}
                        </span>
                      </td>

                      <td>
                        <button className="view-customer-btn">
                          View
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Customers;