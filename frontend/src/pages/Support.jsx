import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Support.css";

function Support() {
  return (
    <>
      <Navbar />

      <main className="support-page">
        {/* HEADING */}

        <section className="support-heading">
          <p>RIZO SUPPORT</p>

          <h1>HOW CAN WE HELP?</h1>

          <span>
            Find answers to your questions and get help with your RIZO orders.
          </span>
        </section>


        {/* SUPPORT CARDS */}

        <section className="support-container">

          {/* ORDER */}

          <Link to="/faqs" className="support-card">
            <div className="support-icon">📦</div>

            <div>
              <h2>Order & Delivery</h2>

              <p>
                Get help with your orders, shipping and delivery information.
              </p>
            </div>

            <span className="support-arrow">→</span>
          </Link>


          {/* RETURNS */}

          <Link to="/faqs" className="support-card">
            <div className="support-icon">↩️</div>

            <div>
              <h2>Returns & Refunds</h2>

              <p>
                Learn about returns, exchanges and refund policies.
              </p>
            </div>

            <span className="support-arrow">→</span>
          </Link>


          {/* PAYMENT */}

          <Link to="/faqs" className="support-card">
            <div className="support-icon">💳</div>

            <div>
              <h2>Payment & Billing</h2>

              <p>
                Find information about payments and billing.
              </p>
            </div>

            <span className="support-arrow">→</span>
          </Link>


          {/* ACCOUNT */}

          <Link to="/profile" className="support-card">
            <div className="support-icon">👤</div>

            <div>
              <h2>Account Help</h2>

              <p>
                Manage your account, profile and personal information.
              </p>
            </div>

            <span className="support-arrow">→</span>
          </Link>

        </section>


        {/* CONTACT SUPPORT */}

        <section className="support-contact">

          <h2>STILL NEED HELP?</h2>

          <p>
            Our support team is here to help you with any questions.
          </p>

          <Link to="/contact" className="support-contact-btn">
            CONTACT US
          </Link>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Support;