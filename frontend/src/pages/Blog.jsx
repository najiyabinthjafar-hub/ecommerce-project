import { useEffect } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Blog.css";

function Blog() {
  const blogs = [
    {
      id: 1,
      category: "FASHION",
      title: "How to Build Your Perfect Everyday Wardrobe",
      description:
        "Discover simple fashion essentials that can help you create stylish outfits for every day.",
      date: "August 20, 2026",
      image:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      category: "STYLE GUIDE",
      title: "5 Fashion Trends You Should Know",
      description:
        "Explore the latest trends and discover easy ways to include them in your personal style.",
      date: "August 15, 2026",
      image:
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      category: "RIZO EDIT",
      title: "New Season, New Style",
      description:
        "A new season is the perfect opportunity to refresh your wardrobe and try something different.",
      date: "August 10, 2026",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      category: "FASHION",
      title: "How to Choose the Right Outfit",
      description:
        "Simple tips to help you choose outfits that make you feel comfortable and confident.",
      date: "August 5, 2026",
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      category: "STYLE GUIDE",
      title: "Minimal Fashion for Everyday Life",
      description:
        "Learn how to create clean and stylish looks with simple and timeless clothing.",
      date: "July 28, 2026",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      category: "RIZO EDIT",
      title: "Behind the Style at RIZO",
      description:
        "Take a look at the inspiration and creativity behind the fashion collections at RIZO.",
      date: "July 20, 2026",
      image:
        "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Scroll to top when page opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      <main className="blog-page">

        {/* HERO */}
        <section className="blog-heading">
          <p>RIZO JOURNAL</p>

          <h1>BLOG</h1>

          <span>
            Fashion inspiration, style guides and everything happening at RIZO.
          </span>
        </section>

        {/* FEATURED BLOG */}
        <section className="featured-blog">

          <div className="featured-image">
            <img
              src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=80"
              alt="Featured fashion"
            />
          </div>

          <div className="featured-content">
            <p className="blog-category">FEATURED</p>

            <h2>Discover Your Personal Style</h2>

            <p className="featured-description">
              Fashion is a way to express yourself. Discover simple tips and
              inspiration to help you build a wardrobe that feels uniquely
              yours.
            </p>

            <button type="button">
              READ MORE →
            </button>
          </div>

        </section>

        {/* LATEST STORIES */}
        <section className="latest-stories">

          <div className="stories-heading">
            <p>LATEST STORIES</p>

            <h2>FROM THE JOURNAL</h2>
          </div>

          <div className="blog-grid">

            {blogs.map((blog) => (
              <article
                className="blog-card"
                key={blog.id}
              >

                <div className="blog-image">
                  <img
                    src={blog.image}
                    alt={blog.title}
                  />
                </div>

                <div className="blog-content">

                  <div className="blog-meta">
                    <span>{blog.category}</span>
                    <span>{blog.date}</span>
                  </div>

                  <h3>{blog.title}</h3>

                  <p>{blog.description}</p>

                  <button type="button">
                    READ ARTICLE →
                  </button>

                </div>

              </article>
            ))}

          </div>

        </section>

        {/* NEWSLETTER */}
        <section className="blog-newsletter">

          <p>STAY UPDATED</p>

          <h2>JOIN THE RIZO COMMUNITY</h2>

          <span>
            Get the latest fashion news, style inspiration and exclusive
            updates.
          </span>

          <form
            onSubmit={(e) => {
              e.preventDefault();

              alert("Thank you for subscribing!");

              e.target.reset();
            }}
          >

            <input
              type="email"
              placeholder="Enter your email address"
              required
            />

            <button type="submit">
              SUBSCRIBE
            </button>

          </form>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Blog;