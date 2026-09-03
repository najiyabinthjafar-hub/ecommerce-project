import instagram1 from "../assets/insta1.png";
import instagram2 from "../assets/insta2.png";
import instagram3 from "../assets/insta3.png";
import instagram4 from "../assets/insta4.png";
import instagram5 from "../assets/cate2.png";
import instagram6 from "../assets/sum.png";
import instagram7 from "../assets/insta7.png"; 

import "./InstagramSection.css";

function InstagramSection() {
  const images = [
    instagram1,
    instagram2,
    instagram3,
    instagram4,
    instagram5,
    instagram6,
    instagram7,
  ];

  return (
    <section className="instagram-section">

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

      <div className="instagram-grid">
        {images.map((image, index) => (
          <div className="instagram-image" key={index}>
            <img
              src={image}
              alt={`Instagram ${index + 1}`}
            />
          </div>
        ))}
      </div>

    </section>
  );
}

export default InstagramSection;