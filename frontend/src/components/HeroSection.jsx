import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import insta1 from "../assets/insta1.png";
import insta2 from "../assets/insta2.png";
import insta3 from "../assets/insta3.png";
import insta4 from "../assets/insta4.png";
import insta7 from "../assets/insta7.png";

import "./HeroSection.css";

const images = [insta1, insta2, insta3, insta4, insta7];

function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(2);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % images.length);
  };

  // NEW COLLECTION CLICK
  const handleNewCollection = () => {
    navigate("/new-arrivals");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getPosition = (index) => {
    const total = images.length;

    let position = index - activeIndex;

    if (position > Math.floor(total / 2)) {
      position -= total;
    }

    if (position < -Math.floor(total / 2)) {
      position += total;
    }

    return position;
  };

  return (
    <section className="hero">
      <div className="hero-logo">RIZO</div>

      {/* Background circle */}
      <div className="hero-circle"></div>

      {/* Centre horizontal connecting line */}
      <div className="middle-line"></div>

      <div className="hero-slider">
        {images.map((image, index) => {
          const position = getPosition(index);

          const isActive = position === 0;

          return (
            <div
              key={index}
              className={`hero-slide position-${position} ${
                isActive ? "active" : ""
              }`}
            >
              <img
                src={image}
                alt={`Rizo collection ${index + 1}`}
              />

              {isActive && (
                <button
                  className="new-collection"
                  onClick={handleNewCollection}
                >
                  NEW COLLECTION
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Arrow */}
      <button
        className="hero-next"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        →
      </button>

      {/* Bottom line */}
      <div className="hero-lines">
        <span></span>
      </div>
    </section>
  );
}

export default HeroSection;