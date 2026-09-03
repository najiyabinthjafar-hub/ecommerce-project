import "./Newsletter.css";

import leftImage from "../assets/newsletter-left.png";
import rightImage from "../assets/newsletter-right.png";

function Newsletter() {
  return (
    <section className="newsletter-section">

      <div className="newsletter-model newsletter-left">
        <img
          src={leftImage}
          alt="Fashion model"
        />
      </div>

      <div className="newsletter-content">

        <h2>Subscribe To Our Newsletter</h2>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Scelerisque duis ultrices sollicitudin aliquam.
        </p>

        <form
          className="newsletter-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email"
            required
          />

          <button type="submit">
            Subscribe Now
          </button>
        </form>

      </div>

      <div className="newsletter-model newsletter-right">
        <img
          src={rightImage}
          alt="Fashion model"
        />
      </div>

    </section>
  );
}

export default Newsletter;