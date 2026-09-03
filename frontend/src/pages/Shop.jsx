import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Shop.css";

import product1 from "../assets/product-5.png";
import product2 from "../assets/product-6.png";
import product3 from "../assets/product-7.png";
import product4 from "../assets/product-8.png";

const products = [
  {
    id: 1,
    name: "Vintage Graphic Black T-Shirt",
    price: 1299,
    image: product1,
  },
  {
    id: 2,
    name: "Classic White Graphic T-Shirt",
    price: 1399,
    image: product2,
  },
  {
    id: 3,
    name: "Eagle Graphic White T-Shirt",
    price: 1499,
    image: product3,
  },
  {
    id: 4,
    name: "Wings Graphic White T-Shirt",
    price: 1499,
    image: product4,
  },
  {
    id: 5,
    name: "Vintage Graphic Black T-Shirt",
    price: 1299,
    image: product1,
  },
  {
    id: 6,
    name: "Classic White Graphic T-Shirt",
    price: 1399,
    image: product2,
  },
  {
    id: 7,
    name: "Eagle Graphic White T-Shirt",
    price: 1499,
    image: product3,
  },
  {
    id: 8,
    name: "Wings Graphic White T-Shirt",
    price: 1499,
    image: product4,
  },
];

function Shop() {
  return (
    <>
      <Navbar />

      <main className="shop-page">

        <section className="shop-heading">

          <h1>SHOP</h1>
          
        </section>

        <section className="shop-filter-bar">

          <div className="filter-left">
            <span>FILTER</span>
            <span>AVAILABILITY ↓</span>
            <span>PRICE ↓</span>
          </div>

          <div className="filter-right">
            <span>
              SORT BY: <b>FEATURED</b> ↓
            </span>

            <span>48 PRODUCTS</span>
          </div>

        </section>

        <section className="shop-products">

          {products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              className="shop-product-card"
              key={product.id}
            >
              <div className="shop-product-image">

                <img
                  src={product.image}
                  alt={product.name}
                />

              </div>

              <div className="shop-product-info">

                <h3>
                  {product.name}
                </h3>

                <p>
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

              </div>
            </Link>
          ))}

        </section>

        <div className="shop-pagination">
          <button>←</button>
          <button className="active">1</button>
          <button>2</button>
          <button>→</button>
        </div>

      </main>

      <Footer />
    </>
  );
}

export default Shop;