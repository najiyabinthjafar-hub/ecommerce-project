import "./SummerSection.css";

import summerImage from "../assets/summer.png";

function SummerSection() {
  return (
    <section className="summer-section">

      {/* LEFT IMAGE */}
      <div className="summer-image">
        <img
          src={summerImage}
          alt="Rizo Hoodies"
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

        <button className="summer-button">
          Explore More
        </button>

      </div>

      {/* SLIDER CONTROLS */}
      <div className="summer-controls">

        <div className="summer-dots">
          <span className="active"></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="summer-arrows">
          <button>‹</button>
          <button>›</button>
        </div>

      </div>

    </section>
  );
}

export default SummerSection;