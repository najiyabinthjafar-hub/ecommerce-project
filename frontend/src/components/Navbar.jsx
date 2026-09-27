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

const API_URL = "http://localhost:5000/api";

function Navbar() {
  const [showSearch, setShowSearch] = useState(false);

  const [search, setSearch] = useState("");

  const [showMenu, setShowMenu] = useState(false);

  const [cartCount, setCartCount] = useState(0);

  const [wishlistCount, setWishlistCount] = useState(0);

  const navigate = useNavigate();

  const navbarRef = useRef(null);

  // User login ചെയ്തിട്ടുണ്ടോ എന്ന് പരിശോധിക്കുന്നു
  const token = localStorage.getItem("token");

  // =========================
  // FETCH CART + WISHLIST COUNT
  // =========================

  useEffect(() => {
    const fetchCounts = async () => {
      if (!token) {
        setCartCount(0);
        setWishlistCount(0);
        return;
      }

      try {
        // CART
        const cartResponse = await fetch(`${API_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (cartResponse.ok) {
          const cartData = await cartResponse.json();

          const cartItems = cartData.cart?.items || [];

          // Number of products/items in cart
          setCartCount(cartItems.length);
        } else {
          setCartCount(0);
        }

        // WISHLIST
        const wishlistResponse = await fetch(
          `${API_URL}/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (wishlistResponse.ok) {
          const wishlistData =
            await wishlistResponse.json();

          const wishlistProducts =
            wishlistData.wishlist?.products || [];

          // Number of products in wishlist
          setWishlistCount(wishlistProducts.length);
        } else {
          setWishlistCount(0);
        }
      } catch (error) {
        console.error(
          "Navbar count fetch error:",
          error
        );

        setCartCount(0);
        setWishlistCount(0);
      }
    };

    fetchCounts();

    // Refresh count when cart/wishlist changes
    const handleCartWishlistUpdate = () => {
      fetchCounts();
    };

    window.addEventListener(
      "cartUpdated",
      handleCartWishlistUpdate
    );

    window.addEventListener(
      "wishlistUpdated",
      handleCartWishlistUpdate
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartWishlistUpdate
      );

      window.removeEventListener(
        "wishlistUpdated",
        handleCartWishlistUpdate
      );
    };
  }, [token]);

  // =========================
  // CLOSE SEARCH AND MENU
  // =========================

  const closeSearch = () => {
    setShowSearch(false);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setShowSearch(false);
  };

  // =========================
  // SEARCH FUNCTION
  // =========================

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

  // =========================
  // CLOSE SEARCH WHEN CLICKING OUTSIDE
  // =========================

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

  // =========================
  // CLOSE SEARCH ON ESCAPE
  // =========================

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

          {wishlistCount > 0 && (
            <span className="nav-count wishlist-count">
              {wishlistCount}
            </span>
          )}
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

          {cartCount > 0 && (
            <span className="nav-count cart-count">
              {cartCount}
            </span>
          )}
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