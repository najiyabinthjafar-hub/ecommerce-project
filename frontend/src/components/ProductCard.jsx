function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

        <button className="product-wishlist" aria-label="Add to wishlist">
          ♡
        </button>
      </div>

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <h3>{product.name}</h3>

        <p className="product-price">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </article>
  );
}

export default ProductCard;