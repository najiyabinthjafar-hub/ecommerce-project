import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./About.css";

function About() {
  return (
    <>
      <Navbar />

      <main className="about-page">
        <section className="about-section">
          <h1>ABOUT RIZO.</h1>

          <div className="about-content">
            <p>
              Alwayshue is more than just a clothing brand—it's a statement of
              individuality, creativity, and self-expression. Founded in 2023,
              our mission is simple: to bring high-quality, well-designed
              fashion to everyone without compromising on affordability or
              vibe. Each piece is crafted with purpose, blending timeless
              aesthetics with modern influences to create styles that feel as
              good as they look. At Alwayshue, we believe that great design
              should be accessible, inspiring, and a reflection of who you
              are.
            </p>

            <p>
              Behind Alwayshue are founders with 15 years of experience in the
              design and social media industry. Having worked at the
              intersection of creativity and culture, they saw a gap where
              affordability often meant sacrificing quality. Determined to
              change this, they built Alwayshue to redefine fashion—where
              premium craftsmanship meets everyday wearability. Their vision
              is to create more than just clothing; it's about building a
              community that values authenticity, positivity, and style that
              lasts.
            </p>

            <p className="about-tagline">
              Be bold. Be You. Be the Hue.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;