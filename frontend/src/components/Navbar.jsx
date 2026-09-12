import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";

import "./Navbar.css";

function Navbar() {
  const [showSearch, setShowSearch] = useState(false);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // User login ചെയ്തിട്ടുണ്ടോ എന്ന് പരിശോധിക്കുന്നു
  const token = localStorage.getItem("token");

  // SEARCH FUNCTION
  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search)}`);

      setSearch("");

      setShowSearch(false);
    }
  };

  return (
    <header className="navbar">

      {/* LOGO */}
      <Link to="/" className="logo">
        <img src={logo} alt="Rizo" />
      </Link>

      {/* NAVIGATION LINKS */}
      <nav className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/shop">Shop</Link>

        <Link to="/new-arrivals">New Arrivals</Link>

        <Link to="/about">About</Link>

        <Link to="/contact">Contact</Link>
      </nav>

      {/* NAV ICONS */}
      <div className="nav-icons">

        {/* SEARCH ICON */}
        <button
          type="button"
          aria-label="Search"
          onClick={() => setShowSearch(!showSearch)}
        >
          ⌕
        </button>

        {/* ACCOUNT ICON */}
        <Link
          to={token ? "/profile" : "/login"}
          aria-label="Account"
        >
          ♙
        </Link>

        {/* WISHLIST ICON ❤️ */}
        <Link
          to="/wishlist"
          aria-label="Wishlist"
          className="wishlist-nav-icon"
        >
          ♡
        </Link>

        {/* CART ICON */}
        <Link to="/cart" aria-label="Cart">
          🛒
        </Link>

      </div>

      {/* SEARCH BOX */}
      {showSearch && (
        <form
          className="search-box"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />

          <button type="submit">
            Search
          </button>

        </form>
      )}

    </header>
  );
}

export default Navbar;