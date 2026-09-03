import "./CategorySection.css";
import { Link } from "react-router-dom";
import tshirtImage from "../assets/cate1.png";
import shirtImage from "../assets/cate2.png";
import womenImage from "../assets/cate3.png";

function CategorySection() {
  return (
    <section className="category-section">
      {/* LEFT CONTENT */}
      <div className="category-content">
        <h2>Essentials by Category</h2>

        <p className="category-description">
          Explore our must-have styles—hoodies, sweatshirts, and classic
          tees—sorted by category for your perfect everyday look.
        </p>

        <Link to="/category" className="explore-btn">
  Explore More
</Link>

        {/* COUNTDOWN */}
        <div className="countdown-section">
          <h3>Hurry, Before It's Too Late!</h3>

          <div className="countdown">
            <div className="time-box">
              <strong>02</strong>
              <span>Days</span>
            </div>

            <div className="time-box">
              <strong>06</strong>
              <span>Hr</span>
            </div>

            <div className="time-box">
              <strong>05</strong>
              <span>Mins</span>
            </div>

            <div className="time-box">
              <strong>30</strong>
              <span>Sec</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PRODUCT SLIDER */}
      <div className="category-slider">
        <div className="category-products">
          {/* MAIN PRODUCT */}
          <div className="category-product main-product">
            <img src={tshirtImage} alt="T-Shirt" />

            <div className="product-label">T - SHIRT</div>
          </div>

          {/* SECOND PRODUCT */}
          <div className="category-product side-product">
            <img src={shirtImage} alt="Shirt" />
          </div>

          {/* THIRD PRODUCT */}
          <div className="category-product side-product">
            <img src={womenImage} alt="Women Collection" />
          </div>
        </div>

        {/* CONTROLS */}
        <div className="category-controls">
          <button className="slider-arrow">‹</button>

          <button className="slider-arrow">›</button>

          <div className="slider-dots">
            <span className="active"></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
