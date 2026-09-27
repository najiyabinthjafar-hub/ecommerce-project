import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BestSellers.css";

const API_URL =
  "http://localhost:5000/api/products/best-sellers";

function BestSellers() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch best sellers"
          );
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error("BEST SELLERS ERROR:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const handleViewMore = () => {
    navigate("/best-sellers");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleWishlist = (e, product) => {
    e.stopPropagation();

    console.log("Wishlist clicked:", product._id || product.id);

    // Wishlist API connect cheyyumbol ivide add cheyyam
  };

  const getImageUrl = (product) => {
    let image =
      product.images?.[0] ||
      product.image ||
      "";

    if (image && !image.startsWith("http")) {
      image = `http://localhost:5000${
        image.startsWith("/") ? "" : "/"
      }${image}`;
    }

    return image;
  };

  if (loading) {
    return (
      <section className="best-sellers">
        <div className="best-sellers-heading">
          <h2>Best Sellers</h2>
          <p>Loading best sellers...</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="best-sellers">
        <div className="best-sellers-heading">
          <h2>Best Sellers</h2>
          <p>No best seller products found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="best-sellers">
      <div className="best-sellers-heading">
        <h2>Best Sellers</h2>

        <p>
          Step into the latest drops that define the season.
          <br />
          From bold basics to fresh fits—just landed.
        </p>
      </div>

      <div className="best-sellers-grid">
        {products.slice(0, 3).map((product) => {
          const productId = product._id || product.id;

          return (
            <div
              className="best-seller-card"
              key={productId}
              onClick={() =>
                navigate(`/product/${productId}`)
              }
            >
              {/* Wishlist Button */}
              <button
                className="best-seller-wishlist"
                onClick={(e) => handleWishlist(e, product)}
                title="Add to Wishlist"
                aria-label="Add to Wishlist"
              >
                ♡
              </button>

              {/* Product Image */}
              <div className="best-seller-image">
                <img
                  src={getImageUrl(product)}
                  alt={product.name || "Best Seller"}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="best-sellers-button"
        onClick={handleViewMore}
      >
        View More
      </button>
    </section>
  );
}

export default BestSellers;