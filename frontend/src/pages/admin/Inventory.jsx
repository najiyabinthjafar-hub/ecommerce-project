
import AdminSidebar from "../../components/admin/AdminSidebar";
import "./Inventory.css";

function Inventory() {
  const inventory = [
    {
      id: 1,
      product: "Classic T-Shirt",
      sku: "TSH-001",
      stock: 45,
      status: "In Stock",
    },
    {
      id: 2,
      product: "Casual Shirt",
      sku: "SHT-002",
      stock: 18,
      status: "Low Stock",
    },
    {
      id: 3,
      product: "Denim Jeans",
      sku: "JNS-003",
      stock: 0,
      status: "Out of Stock",
    },
    {
      id: 4,
      product: "Cotton Kurti",
      sku: "KRT-004",
      stock: 32,
      status: "In Stock",
    },
  ];

  return (
    <div className="inventory-layout">
      <AdminSidebar />

      <main className="inventory-main">
        <div className="inventory-content">

          <div className="inventory-header">
            <div>
              <h1>Inventory</h1>
              <p>Manage your product stock</p>
            </div>
          </div>

          <div className="inventory-stats">

            <div className="inventory-stat-card">
              <span>Total Products</span>
              <strong>250</strong>
            </div>

            <div className="inventory-stat-card">
              <span>In Stock</span>
              <strong>218</strong>
            </div>

            <div className="inventory-stat-card">
              <span>Low Stock</span>
              <strong>20</strong>
            </div>

            <div className="inventory-stat-card">
              <span>Out of Stock</span>
              <strong>12</strong>
            </div>

          </div>

          <div className="inventory-card">

            <div className="inventory-card-header">
              <div>
                <h2>Stock Overview</h2>
                <p>View and manage product inventory</p>
              </div>

              <input
                type="text"
                placeholder="Search products..."
                className="inventory-search"
              />
            </div>

            <div className="inventory-table-container">
              <table className="inventory-table">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {inventory.map((item, index) => (
                    <tr key={item.id}>

                      <td>{index + 1}</td>

                      <td className="inventory-product">
                        {item.product}
                      </td>

                      <td>{item.sku}</td>

                      <td className="inventory-stock">
                        {item.stock}
                      </td>

                      <td>
                        <span
                          className={`inventory-status ${item.status
                            .toLowerCase()
                            .replaceAll(" ", "-")}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <button className="update-stock-btn">
                          Update
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

export default Inventory;

