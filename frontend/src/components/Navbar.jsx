import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">

      <Link to="/" className="logo">
        <img src={logo} alt="Rizo" />
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/new-arrivals">New Arrivals</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <div className="nav-icons">

        <button type="button" aria-label="Search">
          ⌕
        </button>

        <Link to="/login" aria-label="Account">
          ♙
        </Link>

        <Link to="/cart" aria-label="Cart">
          🛒
        </Link>

      </div>

    </header>
  );
}

export default Navbar;