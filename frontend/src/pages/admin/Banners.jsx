import AdminSidebar from "../../components/admin/AdminSidebar";
import "./Banners.css";

function Banners() {
  return (
    <div className="banners-layout">
      <AdminSidebar />

      <main className="banners-main">
        <div className="banners-content">

          <div className="banners-header">
            <div>
              <h1>Banners</h1>
              <p>Manage your store banners</p>
            </div>

            <button className="add-banner-btn">
              + Add Banner
            </button>
          </div>

          <div className="banners-card">

            <div className="banners-card-header">
              <div>
                <h2>All Banners</h2>
                <p>Manage promotional banners</p>
              </div>
            </div>

            <div className="banners-grid">

              <div className="banner-item">
                <div className="banner-image">
                  <span className="banner-placeholder">
                    Banner Image
                  </span>
                </div>

                <div className="banner-info">
                  <h3>Summer Collection</h3>
                  <p>Summer sale promotional banner</p>

                  <span className="banner-status">
                    Active
                  </span>

                  <div className="banner-actions">
                    <button className="edit-banner-btn">
                      Edit
                    </button>

                    <button className="delete-banner-btn">
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="banner-item">
                <div className="banner-image">
                  <span className="banner-placeholder">
                    Banner Image
                  </span>
                </div>

                <div className="banner-info">
                  <h3>New Arrivals</h3>
                  <p>Latest products promotional banner</p>

                  <span className="banner-status">
                    Active
                  </span>

                  <div className="banner-actions">
                    <button className="edit-banner-btn">
                      Edit
                    </button>

                    <button className="delete-banner-btn">
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="banner-item">
                <div className="banner-image">
                  <span className="banner-placeholder">
                    Banner Image
                  </span>
                </div>

                <div className="banner-info">
                  <h3>Special Offers</h3>
                  <p>Special discount promotional banner</p>

                  <span className="banner-status">
                    Active
                  </span>

                  <div className="banner-actions">
                    <button className="edit-banner-btn">
                      Edit
                    </button>

                    <button className="delete-banner-btn">
                      Delete
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Banners;