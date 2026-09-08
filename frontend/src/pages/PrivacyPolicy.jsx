import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./PrivacyPolicy.css";

function PrivacyPolicy() {
  return (
    <>
      <Navbar />

      <main className="policy-page">
        <section className="policy-container">

          <div className="policy-heading">
            <p>RIZO FASHION</p>

            <h1>PRIVACY POLICY</h1>

            <span>
              Learn how we collect, use, and protect your information.
            </span>
          </div>

          <div className="policy-content">

            <section className="policy-section">
              <h2>Information We Collect</h2>

              <p>
                When you use RIZO Fashion, we may collect information such
                as your name, email address, phone number, shipping address,
                and order details.
              </p>
            </section>

            <section className="policy-section">
              <h2>How We Use Your Information</h2>

              <p>
                Your information is used to process orders, deliver products,
                communicate with you, and improve your shopping experience.
              </p>

              <p>
                We may also use your information to provide customer support
                and send important updates regarding your orders.
              </p>
            </section>

            <section className="policy-section">
              <h2>Protecting Your Information</h2>

              <p>
                We take reasonable steps to protect your personal information
                and keep your data secure.
              </p>

              <p>
                Your information is handled carefully and is only used for
                purposes related to providing our services.
              </p>
            </section>

            <section className="policy-section">
              <h2>Sharing Information</h2>

              <p>
                We do not sell your personal information to third parties.
              </p>

              <p>
                Your information may only be shared with trusted services
                required to process orders and deliver products.
              </p>
            </section>

            <section className="policy-section">
              <h2>Cookies</h2>

              <p>
                Our website may use cookies to improve your browsing
                experience and understand how visitors use our website.
              </p>
            </section>

            <section className="policy-section">
              <h2>Your Privacy</h2>

              <p>
                You have the right to access and update your personal
                information. You can manage your account details through
                your RIZO account.
              </p>
            </section>

            <section className="policy-section">
              <h2>Questions About Privacy?</h2>

              <p>
                If you have any questions about our Privacy Policy,
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

export default PrivacyPolicy;