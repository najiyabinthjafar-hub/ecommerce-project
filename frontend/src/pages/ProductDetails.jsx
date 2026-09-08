import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import product1 from "../assets/product-1.png";
import product2 from "../assets/product-2.png";
import product3 from "../assets/product-3.png";
import product4 from "../assets/product-4.png";
import product5 from "../assets/product-5.png";
import product6 from "../assets/product-6.png";
import product7 from "../assets/product-7.png";
import product8 from "../assets/product-8.png";

import plainShirt from "../assets/whiteshirt.png";

import "./ProductDetails.css";

const products = [
  // ================= MEN'S FASHION =================

  {
    id: 1,
    name: "White Adrenaline Tee",
    category: "MEN'S FASHION",
    price: 946,
    image: product1,
    description:
      "A stylish and comfortable white t-shirt designed for everyday wear.",
  },
  {
    id: 2,
    name: "Black Graphic Tee",
    category: "MEN'S FASHION",
    price: 946,
    image: product2,
    description:
      "A modern black graphic t-shirt with a bold and stylish design.",
  },
  {
    id: 3,
    name: "Oversized Graphic Tee",
    category: "MEN'S FASHION",
    price: 946,
    image: product3,
    description:
      "An oversized graphic t-shirt designed for a comfortable streetwear look.",
  },
  {
    id: 4,
    name: "White Printed Tee",
    category: "MEN'S FASHION",
    price: 946,
    image: product4,
    description:
      "A clean and stylish printed white t-shirt for everyday fashion.",
  },
  {
    id: 5,
    name: "Classic Black Tee",
    category: "MEN'S FASHION",
    price: 946,
    image: product5,
    description:
      "A classic black t-shirt designed for comfort and everyday style.",
  },
  {
    id: 6,
    name: "Essential White Tee",
    category: "MEN'S FASHION",
    price: 946,
    image: product6,
    description:
      "An essential white tee that fits perfectly into your everyday wardrobe.",
  },
  {
    id: 7,
    name: "Eagle Graphic Tee",
    category: "MEN'S FASHION",
    price: 946,
    image: product7,
    description:
      "A bold eagle graphic t-shirt designed for a modern streetwear look.",
  },
  {
    id: 8,
    name: "Vintage Graphic Tee",
    category: "MEN'S FASHION",
    price: 946,
    image: product8,
    description:
      "A stylish vintage graphic t-shirt with a comfortable everyday fit.",
  },

  // ================= WOMEN'S FASHION =================

  {
    id: 9,
    name: "Women's White Collection",
    category: "WOMEN'S FASHION",
    price: 946,
    image: product1,
    description:
      "A stylish white collection designed for a comfortable and modern look.",
  },
  {
    id: 10,
    name: "Women's Black Collection",
    category: "WOMEN'S FASHION",
    price: 946,
    image: product2,
    description:
      "A fashionable black collection created for everyday style and comfort.",
  },
  {
    id: 11,
    name: "Women's Oversized Collection",
    category: "WOMEN'S FASHION",
    price: 946,
    image: product3,
    description:
      "An oversized collection designed for a relaxed and stylish appearance.",
  },
  {
    id: 12,
    name: "Women's Printed Collection",
    category: "WOMEN'S FASHION",
    price: 946,
    image: product4,
    description:
      "A beautiful printed collection designed to add style to your wardrobe.",
  },
  {
    id: 13,
    name: "Women's Classic Collection",
    category: "WOMEN'S FASHION",
    price: 946,
    image: product5,
    description:
      "A classic collection that combines comfort and timeless fashion.",
  },
  {
    id: 14,
    name: "Women's Essential Collection",
    category: "WOMEN'S FASHION",
    price: 946,
    image: product6,
    description:
      "An essential collection perfect for everyday comfort and style.",
  },
  {
    id: 15,
    name: "Women's Eagle Collection",
    category: "WOMEN'S FASHION",
    price: 946,
    image: product7,
    description:
      "A bold and stylish graphic collection with a modern fashion look.",
  },
  {
    id: 16,
    name: "Women's Vintage Collection",
    category: "WOMEN'S FASHION",
    price: 946,
    image: product8,
    description:
      "A vintage-inspired collection designed for a unique and fashionable look.",
  },
];

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [selectedImage, setSelectedImage] = useState(
    product ? product.image : ""
  );

  const [selectedColor, setSelectedColor] =
    useState("White");

  const [selectedSize, setSelectedSize] =
    useState("S");

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <>
        <Navbar />

        <main className="product-not-found">
          <h1>Product Not Found</h1>
          <p>The product you're looking for doesn't exist.</p>
        </main>

        <Footer />
      </>
    );
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) =>
      prev > 1 ? prev - 1 : 1
    );
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleAddToCart = () => {
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = existingCart.find(
      (item) =>
        item.id === product.id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item.id === product.id &&
        item.size === selectedSize &&
        item.color === selectedColor
          ? {
              ...item,
              quantity: item.quantity + quantity,
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: selectedImage,
          size: selectedSize,
          color: selectedColor,
          quantity,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    navigate("/cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
  };

  return (
    <>
      <Navbar />

      <main className="product-details-page">
        <div className="product-details-container">

          {/* LEFT SIDE */}
          <div className="product-gallery">

            <div className="product-main-image">
              <img
                src={selectedImage}
                alt={product.name}
              />
            </div>

            <div className="product-thumbnails">
              <button
                className={`thumbnail ${
                  selectedImage === product.image
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedImage(product.image)
                }
              >
                <img
                  src={product.image}
                  alt={product.name}
                />
              </button>

              <button
                className={`thumbnail ${
                  selectedImage === plainShirt
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedImage(plainShirt)
                }
              >
                <img
                  src={plainShirt}
                  alt="Plain shirt"
                />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="product-details-info">

            <h1>{product.name}</h1>

            <div className="product-price">
              ₹ {product.price.toLocaleString("en-IN")}
            </div>

            <p className="tax-info">
              Taxes included.
            </p>

            {/* COLOR */}
            <div className="color-section">

              <div className="color-label">
                <span>COLORS</span>
                <span>{selectedColor}</span>
              </div>

              <div className="color-options">

                {[
                  "White",
                  "Red",
                  "Blue",
                  "Pink",
                  "Black",
                ].map((color) => (
                  <button
                    key={color}
                    className={`color-circle ${color.toLowerCase()} ${
                      selectedColor === color
                        ? "color-selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleColorChange(color)
                    }
                    aria-label={color}
                  />
                ))}

              </div>
            </div>

            {/* SIZE */}
            <div className="size-section">

              <div className="size-label">
                <span>SIZE</span>
                <span>Select your size</span>
              </div>

              <div className="size-options">

                {["S", "M", "L", "XL", "XXL"].map(
                  (size) => (
                    <button
                      key={size}
                      className={
                        selectedSize === size
                          ? "size-selected"
                          : ""
                      }
                      onClick={() =>
                        setSelectedSize(size)
                      }
                    >
                      {size}
                    </button>
                  )
                )}

              </div>
            </div>

            {/* ORDER NOTE */}
            <div className="order-note">
              OUR TEES ARE MADE TO ORDER. PLEASE
              DOUBLE-CHECK YOUR SIZE BEFORE PLACING
              YOUR ORDER.
            </div>

            {/* QUANTITY */}
            <div className="quantity-section">

              <label>
                QUANTITY ({quantity} IN CART)
              </label>

              <div className="quantity-box">

                <button onClick={decreaseQuantity}>
                  −
                </button>

                <span>{quantity}</span>

                <button onClick={increaseQuantity}>
                  +
                </button>

              </div>
            </div>

            {/* BUTTONS */}
            <div className="product-actions">

              <button
                className="add-cart-btn"
                onClick={handleAddToCart}
              >
                ADD TO CART
              </button>

              <button
                className="buy-now-btn"
                onClick={handleBuyNow}
              >
                BUY IT NOW
              </button>

            </div>

            <p className="product-long-description">
              {product.description}
            </p>

          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <section className="you-may-like">

          <h2>Find your next favourite</h2>

          <div className="related-products-grid">

            {products
              .filter(
                (item) => item.id !== product.id
              )
              .slice(0, 4)
              .map((item) => (

                <div
                  className="related-product-card"
                  key={item.id}
                  onClick={() =>
                    navigate(`/product/${item.id}`)
                  }
                >

                  <div className="related-image">
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </div>

                  <p>{item.name}</p>

                  <span>
                    ₹{" "}
                    {item.price.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              ))}

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default ProductDetails;