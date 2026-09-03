import AdminSidebar from "../../components/admin/AdminSidebar";
import "./Coupons.css"; 

function Coupons() {
  const coupons = [
    {
      id: 1,
      code: "SUMMER20",
      discount: "20%",
      type: "Percentage",
      minOrder: "₹1,000",
      expiry: "30 Aug 2026",
      status: "Active",
    },
    {
      id: 2,
      code: "WELCOME10",
      discount: "10%",
      type: "Percentage",
      minOrder: "₹500",
      expiry: "15 Sep 2026",
      status: "Active",
    },
    {
      id: 3,
      code: "SAVE500",
      discount: "₹500",
      type: "Fixed",
      minOrder: "₹2,000",
      expiry: "20 Aug 2026",
      status: "Expired",
    },
    {
      id: 4,
      code: "NEWUSER",
      discount: "15%",
      type: "Percentage",
      minOrder: "₹750",
      expiry: "30 Sep 2026",
      status: "Active",
    },
  ];

  return (
    <div className="coupons-layout">
      <AdminSidebar />

      <main className="coupons-main">
        <div className="coupons-content">

          
          <div className="coupons-header">
            <div>
              <h1>Coupons</h1>
              <p>Manage your store discount coupons</p>
            </div>

            <button className="add-coupon-btn">
              + Add Coupon
            </button>
          </div>

          <div className="coupon-stats">

            <div className="coupon-stat-card">
              <span>Total Coupons</span>
              <strong>24</strong>
            </div>

            <div className="coupon-stat-card">
              <span>Active Coupons</span>
              <strong>18</strong>
            </div>

            <div className="coupon-stat-card">
              <span>Expired</span>
              <strong>6</strong>
            </div>

            <div className="coupon-stat-card">
              <span>Used Coupons</span>
              <strong>142</strong>
            </div>

          </div>

          
          <div className="coupons-card">

            <div className="coupons-card-header">
              <div>
                <h2>All Coupons</h2>
                <p>View and manage discount coupons</p>
              </div>

              <input
                type="text"
                placeholder="Search coupons..."
                className="coupon-search"
              />
            </div>

            <div className="coupons-table-container">
              <table className="coupons-table">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Type</th>
                    <th>Min Order</th>
                    <th>Expiry</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {coupons.map((coupon, index) => (
                    <tr key={coupon.id}>

                      <td>{index + 1}</td>

                      <td>
                        <span className="coupon-code">
                          {coupon.code}
                        </span>
                      </td>

                      <td>{coupon.discount}</td>

                      <td>{coupon.type}</td>

                      <td>{coupon.minOrder}</td>

                      <td>{coupon.expiry}</td>

                      <td>
                        <span
                          className={`coupon-status ${coupon.status.toLowerCase()}`}
                        >
                          {coupon.status}
                        </span>
                      </td>

                      <td>
                        <div className="coupon-actions">
                          <button className="edit-coupon-btn">
                            Edit
                          </button>

                          <button className="delete-coupon-btn">
                            Delete
                          </button>
                        </div>
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

export default Coupons;