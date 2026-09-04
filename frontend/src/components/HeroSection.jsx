import rizoBanner from "../assets/Rizo Banner 1.png";
import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero">
      <img
        src={rizoBanner}
        alt="Rizo New Collection"
        className="rizo-banner"
      />

      <button
        type="button"
        className="hero-collection-link"
        aria-label="New Collection"
      />
    </section>
  );
}

export default HeroSection;