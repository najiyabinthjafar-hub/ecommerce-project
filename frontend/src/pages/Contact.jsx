import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Contact.css";

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
  };

  return (
    <>
      <Navbar />

      <main className="contact-page">
        <section className="contact-section">
          <h1>Contact</h1>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-row">
              <input
                type="text"
                placeholder="NAME"
                name="name"
              />

              <input
                type="email"
                placeholder="EMAIL *"
                name="email"
                required
              />
            </div>

            <input
              type="tel"
              placeholder="PHONE NUMBER"
              name="phone"
            />

            <textarea
              placeholder="COMMENT"
              name="comment"
              rows="6"
            ></textarea>

            <button type="submit">SEND</button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contact;