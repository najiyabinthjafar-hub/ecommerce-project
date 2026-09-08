import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./ShippingPolicy.css";

function ShippingPolicy() {
  return (
    <>
      <Navbar />

      <main className="policy-page">
        <section className="policy-container">

          <div className="policy-heading">
            <p>RIZO FASHION</p>
            <h1>SHIPPING POLICY</h1>
            <span>
              Information about delivery, shipping charges, and order processing.
            </span>
          </div>

          <div className="policy-content">

            <section className="policy-section">
              <h2>Order Processing</h2>

              <p>
                All orders are processed within 1–2 business days after
                your order has been successfully placed.
              </p>

              <p>
                Orders placed on weekends or public holidays will be
                processed on the next working day.
              </p>
            </section>

            <section className="policy-section">
              <h2>Shipping Time</h2>

              <p>
                Once your order has been shipped, delivery usually takes
                between 3–7 business days depending on your location.
              </p>

              <p>
                Delivery times may vary during sales, holidays, or due to
                unexpected shipping delays.
              </p>
            </section>

            <section className="policy-section">
              <h2>Shipping Charges</h2>

              <p>
                We offer free shipping on orders above ₹999.
              </p>

              <p>
                For orders below ₹999, a standard delivery charge may apply.
              </p>
            </section>

            <section className="policy-section">
              <h2>Order Tracking</h2>

              <p>
                Once your order is shipped, you will receive information
                regarding your order and delivery status.
              </p>
            </section>

            <section className="policy-section">
              <h2>Delivery Address</h2>

              <p>
                Please make sure that your shipping address and contact
                details are correct before placing your order.
              </p>

              <p>
                RIZO Fashion cannot be responsible for delays caused by
                incorrect or incomplete delivery information.
              </p>
            </section>

            <section className="policy-section">
              <h2>Need Help?</h2>

              <p>
                If you have any questions about your order or delivery,
                please contact our support team.
              </p>

              <Link to="/support" className="policy-support-btn">
                CONTACT SUPPORT
              </Link>
            </section>

          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}

export default ShippingPolicy;