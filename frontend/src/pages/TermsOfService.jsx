import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./TermsOfService.css";

function TermsOfService() {
  return (
    <>
      <Navbar />

      <main className="policy-page">
        <section className="policy-container">

          <div className="policy-heading">
            <p>RIZO FASHION</p>

            <h1>TERMS OF SERVICE</h1>

            <span>
              Please read these terms carefully before using RIZO Fashion.
            </span>
          </div>

          <div className="policy-content">

            <section className="policy-section">
              <h2>Acceptance of Terms</h2>

              <p>
                By accessing and using the RIZO Fashion website, you agree
                to follow and be bound by these Terms of Service.
              </p>
            </section>

            <section className="policy-section">
              <h2>Products and Orders</h2>

              <p>
                We make every effort to provide accurate information about
                our products, including prices, descriptions, and availability.
              </p>

              <p>
                Product availability may change at any time, and we reserve
                the right to update or remove products when necessary.
              </p>
            </section>

            <section className="policy-section">
              <h2>Pricing</h2>

              <p>
                All product prices displayed on RIZO Fashion are shown in
                Indian Rupees (₹).
              </p>

              <p>
                Prices and offers may change without prior notice.
              </p>
            </section>

            <section className="policy-section">
              <h2>Payments</h2>

              <p>
                Customers must provide accurate information when placing
                an order.
              </p>

              <p>
                Available payment methods will be displayed during the
                checkout process.
              </p>
            </section>

            <section className="policy-section">
              <h2>Shipping and Delivery</h2>

              <p>
                Delivery times may vary depending on your location and
                product availability.
              </p>

              <p>
                Please ensure that your shipping address and contact
                information are correct before placing your order.
              </p>
            </section>

            <section className="policy-section">
              <h2>Returns and Refunds</h2>

              <p>
                Returns and refunds are subject to our Refund Policy.
                Please review the Refund Policy for complete information
                about return eligibility and refund processing.
              </p>
            </section>

            <section className="policy-section">
              <h2>User Responsibilities</h2>

              <p>
                You agree to use the RIZO Fashion website responsibly and
                provide accurate information when creating an account or
                placing an order.
              </p>

              <p>
                Any misuse of the website may result in restricted access
                to our services.
              </p>
            </section>

            <section className="policy-section">
              <h2>Changes to These Terms</h2>

              <p>
                RIZO Fashion may update these Terms of Service from time
                to time. Any changes will be posted on this page.
              </p>
            </section>

            <section className="policy-section">
              <h2>Need Help?</h2>

              <p>
                If you have any questions regarding our Terms of Service,
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

export default TermsOfService;