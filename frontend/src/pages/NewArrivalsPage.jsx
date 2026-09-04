import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

import "./NewArrivalsPage.css";

function NewArrivalsPage() {

  const products = [
    {
      id: 1,
      name: "White Adrenaline Tee",
      category: "MEN'S FASHION",
      price: 946,
      image: "/src/assets/product-1.png",
    },
    {
      id: 2,
      name: "Black Graphic Tee",
      category: "MEN'S FASHION",
      price: 946,
      image: "/src/assets/product-2.png",
    },
    {
      id: 3,
      name: "Oversized Graphic Tee",
      category: "MEN'S FASHION",
      price: 946,
      image: "/src/assets/product-3.png",
    },
    {
      id: 4,
      name: "White Printed Tee",
      category: "MEN'S FASHION",
      price: 946,
      image: "/src/assets/product-4.png",
    },
    {
      id: 5,
      name: "Classic Black Tee",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-5.png",
    },
    {
      id: 6,
      name: "Essential White Tee",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-6.png",
    },
    {
      id: 7,
      name: "Eagle Graphic Tee",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-7.png",
    },
    {
      id: 8,
      name: "Vintage Graphic Tee",
      category: "WOMEN'S FASHION",
      price: 946,
      image: "/src/assets/product-8.png",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="new-arrivals-page">

        {/* Heading */}
        <section className="new-arrivals-page-heading">

          <p className="section-label">
            NEW COLLECTION
          </p>

          <h1>
            New Arrivals
          </h1>

          <p className="new-arrivals-page-description">
            Step into the latest drops that define the season.
            <br />
            From bold basics to fresh fits — just landed.
          </p>

          <div className="fashion-buttons">

            <button className="fashion-btn active">
              Men's Fashion
            </button>

            <button className="fashion-btn">
              Women's Fashion
            </button>

          </div>

        </section>


        {/* Products */}
        <section className="new-arrivals-page-products">

          <div className="new-arrivals-page-top">

            <h2>
              New Arrivals
            </h2>

            <p>
              8 Products
            </p>

          </div>


          <div className="new-arrivals-page-grid">

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default NewArrivalsPage;