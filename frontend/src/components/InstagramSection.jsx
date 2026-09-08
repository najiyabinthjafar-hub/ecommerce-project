import { useEffect, useState } from "react";

import instagram1 from "../assets/insta1.png";
import instagram2 from "../assets/insta2.png";
import instagram3 from "../assets/insta3.png";
import instagram4 from "../assets/insta4.png";
import instagram5 from "../assets/cate2.png";
import instagram6 from "../assets/sum.png";
import instagram7 from "../assets/insta7.png";

import "./InstagramSection.css";

const images = [
  instagram1,
  instagram2,
  instagram3,
  instagram4,
  instagram5,
  instagram6,
  instagram7,
];

function InstagramSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const getImage = (position) => {
    return images[(activeIndex + position) % images.length];
  };

  return (
    <section className="instagram-section">

      {/* HEADING */}
      <div className="instagram-heading">
        <h2>Follow Us On Instagram</h2>

        <p>
          See how the style comes to life beyond the screen.
          <br />
          Exclusive looks, real-time updates, and fresh fits await.
          <br />
          Follow us on Instagram and never miss a vibe.
        </p>
      </div>

      {/* HERO STYLE SLIDER */}
      <div className="instagram-slider">

        <div className="instagram-track">
          {[0, 1, 2, 3, 4, 5, 6].map((position) => (
            <div
              className={`instagram-image image-${position}`}
              key={position}
            >
              <img
                src={getImage(position)}
                alt={`Instagram ${position + 1}`}
              />
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}

export default InstagramSection;