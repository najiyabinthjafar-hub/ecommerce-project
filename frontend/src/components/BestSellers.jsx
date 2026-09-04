import "./BestSellers.css";
import product1 from "../assets/product-8.png";
import product2 from "../assets/product-2.png";
import product3 from "../assets/product-1.png";

function BestSellers() {
  const products = [product1, product2, product3];

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
            <img src={image} alt={`Best Seller ${index + 1}`} />
          </div>
        ))}
      </div>

      <button className="best-sellers-button">
        View More
      </button>
    </section>
  );
}

export default BestSellers;