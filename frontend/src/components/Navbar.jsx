import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        RIZO
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/new-arrivals">New Arrivals</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <div className="nav-icons">
        <button>⌕</button>
        <Link to="/login">♙</Link>
        <Link to="/cart">🛒</Link>
      </div>
    </header>
  );
}

export default Navbar;