import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./FAQs.css";

function FAQs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How can I place an order?",
      answer:
        "Browse our products, select your preferred size, add the product to your cart, and proceed to checkout to place your order.",
    },
    {
      question: "How can I track my order?",
      answer:
        "You can view your order details and status by visiting the My Orders section in your account.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "You can contact our support team as soon as possible to request an order cancellation.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We currently offer Cash on Delivery and other available payment options shown during checkout.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery time may vary depending on your location. Usually, orders are delivered within a few business days.",
    },
    {
      question: "Do you offer free delivery?",
      answer:
        "Yes. Orders above ₹999 are eligible for free delivery. Delivery charges may apply to orders below this amount.",
    },
    {
      question: "Can I change my delivery address?",
      answer:
        "You can update your address before placing an order. For an existing order, please contact our support team.",
    },
    {
      question: "What should I do if I receive a damaged product?",
      answer:
        "Please contact our support team with your order details and information about the damaged product.",
    },
    {
      question: "How can I contact RIZO support?",
      answer:
        "You can visit our Support Centre or Contact page to get in touch with our customer support team.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />

      <main className="faqs-page">

        {/* HEADING */}

        <section className="faqs-heading">
          <p>HELP CENTER</p>

          <h1>FREQUENTLY ASKED QUESTIONS</h1>

          <span>
            Find answers to the most common questions about shopping with RIZO.
          </span>
        </section>


        {/* FAQ LIST */}

        <section className="faqs-container">

          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${
                activeIndex === index ? "active" : ""
              }`}
              key={index}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>

                <span className="faq-icon">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>

              {activeIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}

            </div>
          ))}

        </section>


        {/* SUPPORT SECTION */}

        <section className="faq-support">

          <p>STILL NEED HELP?</p>

          <h2>WE'RE HERE FOR YOU</h2>

          <span>
            Can't find the answer you're looking for? Our support team is ready to help.
          </span>

          <a href="/contact">
            CONTACT US →
          </a>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default FAQs;