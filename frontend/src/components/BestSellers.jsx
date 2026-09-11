import { useNavigate } from "react-router-dom";

import "./BestSellers.css";

import product1 from "../assets/product-8.png";
import product2 from "../assets/product-2.png";
import product3 from "../assets/product-1.png";

function BestSellers() {
  const navigate = useNavigate();

  const products = [product1, product2, product3];

  const handleViewMore = () => {
    navigate("/best-sellers");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

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
        {products.map((image, index) => (
          <div className="best-seller-image" key={index}>
            <img
              src={image}
              alt={`Best Seller ${index + 1}`}
            />
          </div>
        ))}
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