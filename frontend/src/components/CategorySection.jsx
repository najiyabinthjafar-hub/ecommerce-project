import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import insta1 from "../assets/insta1.png";
import insta2 from "../assets/insta2.png";
import insta3 from "../assets/insta3.png";
import insta4 from "../assets/insta4.png";

import "./CategorySection.css";

const images = [insta1, insta2, insta3, insta4];

function CategorySection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  };

  // Automatic slide
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Current visible images
  const getImage = (offset) => {
    return images[(activeIndex + offset) % images.length];
  };

  return (
    <section className="category-section">
      {/* LEFT CONTENT */}
      <div className="category-content">
        <h2>Essentials by Category</h2>

        <p className="category-description">
          Explore our must-have styles—hoodies, sweatshirts,
          <br />
          and classic tees—sorted by category for your perfect
          <br />
          everyday look.
        </p>

        {/* EXPLORE MORE */}
        <Link
          to="/shop"
          className="explore-btn"
          onClick={() => window.scrollTo(0, 0)}
        >
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

      {/* RIGHT SLIDER */}
      <div className="category-slider">
        {/* IMAGES */}
        <div className="visible-images">
          <div className="category-image first-image">
            <img src={getImage(0)} alt="Collection 1" />
          </div>

          <div className="category-image second-image">
            <img src={getImage(1)} alt="Collection 2" />
          </div>

          <div className="category-image third-image">
            <img src={getImage(2)} alt="Collection 3" />
          </div>
        </div>

        {/* ARROWS */}
        <div className="category-controls">
          <div className="category-arrows">
            <button
              className="slider-arrow"
              onClick={prevSlide}
              aria-label="Previous"
            >
              ‹
            </button>

            <button
              className="slider-arrow"
              onClick={nextSlide}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>

        {/* DOTS */}
        <div className="slider-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={index === activeIndex ? "active" : ""}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
