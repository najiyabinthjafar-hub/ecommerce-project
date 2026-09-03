import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-top">

        <Link to="/" className="footer-logo">
          RIZO.
        </Link>

        <div className="footer-links">
          <Link to="/support">Support Center</Link>
          <Link to="/invoicing">Invoicing</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/faqs">FAQs</Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>Copyright © 2026 RIZO. All Rights Reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;