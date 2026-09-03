import { useEffect } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

import "./Category.css";

function Category() {
  // Category page open ചെയ്യുമ്പോൾ page top-il start ചെയ്യാൻ
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

      <main className="category-page">

        {/* Page Heading */}
        <section className="category-page-heading">
          <p className="section-label">
            MEN'S FASHION
          </p>

          <h1>
            All Products in T-Shirts
          </h1>

          <p className="category-page-description">
            Explore our collection of stylish and comfortable T-Shirts.
            <br />
            Find your perfect fit from our latest collection.
          </p>
        </section>

        {/* Products Section */}
        <section className="category-page-products">

          <div className="category-page-top">
            <h2>
              T-Shirts
            </h2>

            <p>
              {products.length} Products
            </p>
          </div>

          <div className="category-page-grid">
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

export default Category;