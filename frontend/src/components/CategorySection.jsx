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

  // ================= COUNTDOWN =================

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 6,
    minutes: 5,
    seconds: 30,
  });

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setTimeLeft((currentTime) => {
        let { days, hours, minutes, seconds } = currentTime;

        // Countdown finished
        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(countdownTimer);
          return currentTime;
        }

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;

          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;

            if (hours > 0) {
              hours--;
            } else {
              hours = 23;

              if (days > 0) {
                days--;
              }
            }
          }
        }

        return {
          days,
          hours,
          minutes,
          seconds,
        };
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);

  const formatTime = (time) => {
    return String(time).padStart(2, "0");
  };

  // ================= SLIDER =================

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
          to="/categories"
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
              <strong>{formatTime(timeLeft.days)}</strong>
              <span>Days</span>
            </div>

            <div className="time-box">
              <strong>{formatTime(timeLeft.hours)}</strong>
              <span>Hr</span>
            </div>

            <div className="time-box">
              <strong>{formatTime(timeLeft.minutes)}</strong>
              <span>Mins</span>
            </div>

            <div className="time-box">
              <strong>{formatTime(timeLeft.seconds)}</strong>
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
