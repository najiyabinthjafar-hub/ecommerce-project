import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import product1 from "../assets/product-5.png";
import product2 from "../assets/product-6.png";
import product3 from "../assets/product-7.png";
import product4 from "../assets/product-8.png";
import plainShirt from "../assets/whiteshirt.png";

import "./ProductDetails.css";

const products = [
  {
    id: 1,
    name: "Vintage Graphic Black T-Shirt",
    price: 1299,
    image: product1,
    category: "T-Shirts",
    description:
      "A timeless graphic t-shirt designed for everyday comfort and effortless style.",
  },
  {
    id: 2,
    name: "Classic White Graphic T-Shirt",
    price: 1399,
    image: product2,
    category: "T-Shirts",
    description:
      "A clean and classic graphic t-shirt that adds a stylish touch to your everyday look.",
  },
  {
    id: 3,
    name: "Eagle Graphic White T-Shirt",
    price: 1499,
    image: product3,
    category: "T-Shirts",
    description:
      "A bold eagle graphic t-shirt crafted for a modern and confident streetwear look.",
  },
  {
    id: 4,
    name: "Wings Graphic White T-Shirt",
    price: 1499,
    image: product4,
    category: "T-Shirts",
    description:
      "A premium graphic t-shirt featuring a distinctive wings design.",
  },
];

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((item) => item.id === Number(id));

  const [selectedImage, setSelectedImage] = useState(
    product ? product.image : ""
  );

  const [selectedColor, setSelectedColor] = useState("White");
  const [selectedSize, setSelectedSize] = useState("S");
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
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);

    // White is the actual plain shirt asset available.
    if (color === "White") {
      setSelectedImage(product.image);
    }
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
          quantity: quantity,
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

            {/* MAIN IMAGE */}
            <div className="product-main-image">
              <img
                src={selectedImage}
                alt={product.name}
              />
            </div>

            {/* TWO THUMBNAILS */}
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
                  alt="Product front"
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

            <h1>White Adrenaline Tee</h1>

            <div className="product-price">
              ₹ 984.00
            </div>

            <p className="tax-info">
              Taxes included.
            </p>

            {/* COLOR */}
            <div className="color-section">

              <div className="color-label">
                <span>colors</span>
                <span>{selectedColor}</span>
              </div>

              <div className="color-options">

                <button
                  className={`color-circle white ${
                    selectedColor === "White"
                      ? "color-selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleColorChange("White")
                  }
                  aria-label="White"
                />

                <button
                  className={`color-circle red ${
                    selectedColor === "Red"
                      ? "color-selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleColorChange("Red")
                  }
                  aria-label="Red"
                />

                <button
                  className={`color-circle blue ${
                    selectedColor === "Blue"
                      ? "color-selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleColorChange("Blue")
                  }
                  aria-label="Blue"
                />

                <button
                  className={`color-circle pink ${
                    selectedColor === "Pink"
                      ? "color-selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleColorChange("Pink")
                  }
                  aria-label="Pink"
                />

                <button
                  className={`color-circle black ${
                    selectedColor === "Black"
                      ? "color-selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleColorChange("Black")
                  }
                  aria-label="Black"
                />

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

            {/* DESCRIPTION */}
            <div className="order-note">
              OUR TEES ARE MADE TO ORDER. PLEASE
              DOUBLE-CHECK YOUR SIZE BEFORE PLACING
              YOUR ORDER.
            </div>

            {/* QUANTITY */}
            <div className="quantity-section">

              <label>
                QUANTITY (1 IN CART)
              </label>

              <div className="quantity-box">

                <button
                  onClick={decreaseQuantity}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                >
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

            {/* DESCRIPTION TEXT */}
            <p className="product-long-description">
              EVERY RACE IS A BATTLE OF SPEED, POWER,
              AND DETERMINATION. THE ADRENALINE TEE
              CAPTURES THIS INTENSITY WITH A STRIKING
              RACE-OFF EFFECT BETWEEN RAW HORSEPOWER
              AND MECHANICAL PRECISION. DESIGNED FOR
              THOSE WHO THRIVE ON THE RUSH, IT
              SYMBOLIZES THE RELENTLESS PURSUIT OF
              VICTORY—WHERE INSTINCT MEETS INNOVATION,
              AND EVERY SECOND COUNTS.
            </p>

          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <section className="you-may-like">

          <h2>Find your next favourite</h2>

          <div className="related-products-grid">

            {products.map((item) => (
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
                  ₹ {item.price.toLocaleString("en-IN")}
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