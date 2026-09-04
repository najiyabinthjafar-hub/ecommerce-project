import "./ProductCard.css";

function ProductCard({ product }) {
  return (
    <div className="product-card">

      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="product-price">
          ₹ {product.price}/-
        </p>
      </div>

    </div>
  );
}

export default ProductCard;