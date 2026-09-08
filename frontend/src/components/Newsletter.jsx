import { useState } from "react";

import "./Newsletter.css";

import leftImage from "../assets/newsletter-left.png";

import rightImage from "../assets/newsletter-right.png";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    setMessage("Successfully subscribed! Thank you ❤️");

    setEmail("");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

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
          onSubmit={handleSubscribe}
        >

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">
            Subscribe Now
          </button>

        </form>

        {message && (
          <p className="subscribe-success-message">
            {message}
          </p>
        )}

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