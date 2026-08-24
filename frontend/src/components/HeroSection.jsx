function HeroSection() {
  return (
    <section className="hero">

      <div className="hero-content">
        <p className="hero-small">NEW COLLECTION</p>

        <h1>
          WEAR YOUR
          <br />
          <span>STORY</span>
        </h1>

        <p className="hero-description">
          Discover timeless essentials designed
          <br />
          for your everyday style.
        </p>

        <button className="primary-btn">
          SHOP COLLECTION
        </button>
      </div>

      <div className="hero-products">

        <div className="hero-card small-card">
          <img
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700"
            alt="T-shirt"
          />
        </div>

        <div className="hero-card main-card">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900"
            alt="Fashion"
          />
          <div className="hero-card-label">
            NEW COLLECTION
          </div>
        </div>

        <div className="hero-card small-card">
          <img
            src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=700"
            alt="Fashion"
          />
        </div>

      </div>

    </section>
  );
}

export default HeroSection;