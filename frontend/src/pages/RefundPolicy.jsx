import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./RefundPolicy.css";

function RefundPolicy() {
  return (
    <>
      <Navbar />

      <main className="policy-page">
        <section className="policy-container">

          <div className="policy-heading">
            <p>RIZO FASHION</p>
            <h1>REFUND POLICY</h1>
            <span>
              Everything you need to know about returns and refunds.
            </span>
          </div>

          <div className="policy-content">

            <section className="policy-section">
              <h2>Returns</h2>

              <p>
                We want you to love your RIZO purchase. If you are not
                completely satisfied with your order, you may request a
                return within 7 days of receiving your product.
              </p>
            </section>

            <section className="policy-section">
              <h2>Return Eligibility</h2>

              <p>Your item must meet the following conditions:</p>

              <ul>
                <li>The product must be unused and unworn.</li>
                <li>The original tags must still be attached.</li>
                <li>The product must be in its original packaging.</li>
                <li>You must provide proof of purchase.</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Refunds</h2>

              <p>
                Once we receive and inspect your returned item, we will
                notify you about the status of your refund.
              </p>

              <p>
                If your return is approved, the refund will be processed
                to your original payment method within 5–7 business days.
              </p>
            </section>

            <section className="policy-section">
              <h2>Non-Returnable Items</h2>

              <p>
                Certain items may not be eligible for return, including
                products that have been worn, washed, damaged, or returned
                without their original tags.
              </p>
            </section>

            <section className="policy-section">
              <h2>Need Help?</h2>

              <p>
                If you have any questions regarding returns or refunds,
                our support team is always happy to help.
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

export default RefundPolicy;