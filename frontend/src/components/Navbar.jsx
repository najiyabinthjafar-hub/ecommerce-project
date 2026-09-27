import { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  UserRound,
  UserRoundCheck,
  ShoppingBag,
  Search,
  Heart,
} from "lucide-react";

import logo from "../assets/logo.png";

import "./Navbar.css";

function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  const navbarRef = useRef(null);

  // User login ചെയ്തിട്ടുണ്ടോ എന്ന് പരിശോധിക്കുന്നു
  const token = localStorage.getItem("token");

  // Close search and menu
  const closeSearch = () => {
    setShowSearch(false);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setShowSearch(false);
  };

  // SEARCH FUNCTION
  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(
        `/shop?search=${encodeURIComponent(
          search.trim()
        )}`
      );

      setSearch("");
      setShowSearch(false);
      setShowMenu(false);
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // Close search when pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowSearch(false);
        setShowMenu(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  return (
    <header
      className="navbar"
      ref={navbarRef}
    >
      {/* LOGO */}
      <Link
        to="/"
        replace
        className="logo"
        onClick={closeMenu}
      >
        <img src={logo} alt="Rizo" />
      </Link>

      {/* DESKTOP NAVIGATION LINKS */}
      <nav
        className={`nav-links ${
          showMenu ? "mobile-open" : ""
        }`}
      >
        <Link
          to="/"
          replace
          onClick={closeMenu}
        >
          Home
        </Link>

        <Link
          to="/shop"
          onClick={closeMenu}
        >
          Shop
        </Link>

        <Link
          to="/new-arrivals"
          onClick={closeMenu}
        >
          New Arrivals
        </Link>

        <Link
          to="/about"
          onClick={closeMenu}
        >
          About
        </Link>

        <Link
          to="/contact"
          onClick={closeMenu}
        >
          Contact
        </Link>
      </nav>

      {/* NAV ICONS */}
      <div className="nav-icons">

        {/* SEARCH ICON */}
        <button
          type="button"
          aria-label="Search"
          onClick={() => {
            setShowSearch((prev) => !prev);
            setShowMenu(false);
          }}
        >
          <Search
            size={14}
            strokeWidth={1.5}
          />
        </button>

        {/* ACCOUNT / LOGIN ICON */}
        <Link
          to={token ? "/profile" : "/login"}
          aria-label={
            token ? "Account" : "Login"
          }
          className="account-icon"
          onClick={closeSearch}
        >
          {token ? (
            <UserRoundCheck
              size={15}
              strokeWidth={1.5}
            />
          ) : (
            <UserRound
              size={15}
              strokeWidth={1.5}
            />
          )}
        </Link>

        {/* WISHLIST ICON */}
        <Link
          to="/wishlist"
          aria-label="Wishlist"
          className="wishlist-nav-icon"
          onClick={closeSearch}
        >
          <Heart
            size={14}
            strokeWidth={1.5}
          />
        </Link>

        {/* CART / SHOPPING BAG ICON */}
        <Link
          to="/cart"
          aria-label="Cart"
          className="cart-nav-icon"
          onClick={closeSearch}
        >
          <ShoppingBag
            size={14}
            strokeWidth={1.5}
          />
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="menu-toggle"
          aria-label="Menu"
          onClick={() => {
            setShowMenu((prev) => !prev);
            setShowSearch(false);
          }}
        >
          {showMenu ? "✕" : "☰"}
        </button>
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
            onChange={(e) =>
              setSearch(e.target.value)
            }
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