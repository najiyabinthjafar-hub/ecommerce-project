import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SummerSection.css";

import summer1 from "../assets/summer.jpg";
import summer2 from "../assets/summer1.jpg";
import summer3 from "../assets/summer2.jpg";
import summer4 from "../assets/summer.png";

const summerImages = [summer1, summer2, summer3, summer4];

function SummerSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useNavigate();

  const nextSlide = () => {
    setActiveIndex(
      (current) => (current + 1) % summerImages.length
    );
  };

  const prevSlide = () => {
    setActiveIndex(
      (current) =>
        (current - 1 + summerImages.length) % summerImages.length
    );
  };

  // Automatic slide every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(
        (current) => (current + 1) % summerImages.length
      );
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  // Explore More
  const handleExploreMore = () => {
    navigate("/shop");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <section className="summer-section">

      {/* LEFT IMAGE SLIDER */}
      <div className="summer-image">
        <img
          key={activeIndex}
          src={summerImages[activeIndex]}
          alt={`Summer Collection ${activeIndex + 1}`}
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="summer-content">
        <h2>Fresh for Summer</h2>

        <p className="summer-description">
          Fresh styles for the sun-soaked days ahead.
          Discover lightweight fabrics and vibrant designs.
          Stay comfortable and stylish all summer long.
        </p>

        <button
          className="summer-button"
          onClick={handleExploreMore}
        >
          Explore More
        </button>
      </div>

      {/* CONTROLS */}
      <div className="summer-controls">

        {/* DOTS */}
        <div className="summer-dots">
          {summerImages.map((_, index) => (
            <span
              key={index}
              className={
                index === activeIndex ? "active" : ""
              }
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>

        {/* ARROWS */}
        <div className="summer-arrows">

          <button
            onClick={prevSlide}
            aria-label="Previous"
          >
            ‹
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next"
          >
            ›
          </button>

        </div>

      </div>

    </section>
  );
}

export default SummerSection;