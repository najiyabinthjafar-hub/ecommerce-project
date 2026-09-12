import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("S");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addingToCart, setAddingToCart] = useState(false);

  // ================= FETCH SINGLE PRODUCT =================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setRelatedProducts([]);

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch product"
          );
        }

        setProduct(data.product);

        if (data.product.images?.length > 0) {
          setSelectedImage(data.product.images[0]);
        }

        // ആദ്യത്തെ variant default ആയി select ചെയ്യുന്നു
        if (data.product.variants?.length > 0) {
          setSelectedSize(data.product.variants[0]);
        }

        setQuantity(1);
      } catch (error) {
        console.error("Product API Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ================= FETCH RELATED PRODUCTS =================

  useEffect(() => {
    if (!product?.category) return;

    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products?limit=100"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch related products"
          );
        }

        const products = data.products || [];

        const currentCategoryId =
          typeof product.category === "object"
            ? product.category._id
            : product.category;

        const related = products
          .filter((item) => {
            // നിലവിലെ product ഒഴിവാക്കുക
            if (String(item._id) === String(id)) {
              return false;
            }

            const itemCategoryId =
              typeof item.category === "object"
                ? item.category._id
                : item.category;

            // Same category products മാത്രം
            return (
              String(itemCategoryId) ===
              String(currentCategoryId)
            );
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt) -
              new Date(a.createdAt)
          )
          .slice(0, 4);

        setRelatedProducts(related);
      } catch (error) {
        console.error(
          "Related Products Error:",
          error
        );

        setRelatedProducts([]);
      }
    };

    fetchRelatedProducts();
  }, [product, id]);

  // ================= LOADING =================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="product-not-found">
          <h1>Loading...</h1>
        </main>

        <Footer />
      </>
    );
  }

  // ================= ERROR / NOT FOUND =================

  if (error || !product) {
    return (
      <>
        <Navbar />

        <main className="product-not-found">
          <h1>Product Not Found</h1>

          <p>
            {error ||
              "The product you're looking for doesn't exist."}
          </p>
        </main>

        <Footer />
      </>
    );
  }

  // ================= PRODUCT PRICE =================

  const productPrice =
    product.salePrice !== null &&
    product.salePrice !== undefined
      ? product.salePrice
      : product.regularPrice;

  // ================= QUANTITY =================

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) =>
      prev > 1 ? prev - 1 : 1
    );
  };

  // ================= ADD TO CART =================

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      alert(
        "This product is currently out of stock."
      );

      return;
    }

    // LOGIN TOKEN
    const token = localStorage.getItem("token");

    // User login ചെയ്തിട്ടില്ലെങ്കിൽ
    if (!token) {
      alert("Please login to add products to your cart.");

      navigate("/login");

      return;
    }

    try {
      setAddingToCart(true);

      const response = await fetch(
        "http://localhost:5000/api/cart/add",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            productId: product._id,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add product to cart"
        );
      }

      console.log("Cart Response:", data);

      alert("Product added to cart successfully!");

      navigate("/cart");
    } catch (error) {
      console.error("Add To Cart Error:", error);

      alert(
        error.message ||
          "Something went wrong while adding the product to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // ================= BUY NOW =================

  const handleBuyNow = async () => {
    if (product.stock === 0) {
      return;
    }

    await handleAddToCart();
  };

  return (
    <>
      <Navbar />

      <main className="product-details-page">
        <div className="product-details-container">

          {/* ================= LEFT SIDE ================= */}

          <div className="product-gallery">

            {/* MAIN IMAGE */}

            <div className="product-main-image">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                />
              ) : (
                <p>No image available</p>
              )}
            </div>

            {/* ================= THUMBNAILS ================= */}

            {product.images?.length > 0 && (
              <div className="product-thumbnails">
                {product.images.map(
                  (image, index) => (
                    <button
                      key={index}
                      className={`thumbnail ${
                        selectedImage === image
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedImage(image)
                      }
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${
                          index + 1
                        }`}
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="product-details-info">

            <h1>{product.name}</h1>

            {/* PRICE */}

            <div className="product-price">
              ₹{" "}
              {Number(
                productPrice || 0
              ).toLocaleString("en-IN")}
            </div>

            <p className="tax-info">
              Taxes included.
            </p>

            {/* ================= SIZE ================= */}

            {product.variants?.length > 0 && (
              <div className="size-section">

                <div className="size-label">
                  <span>SIZE</span>

                  <span>Select your size</span>
                </div>

                <div className="size-options">
                  {product.variants.map((size) => (
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
                  ))}
                </div>

              </div>
            )}

            {/* ================= STOCK ================= */}

            <div className="order-note">
              {product.stock > 0
                ? `${product.stock} ITEMS AVAILABLE`
                : "CURRENTLY OUT OF STOCK"}
            </div>

            {/* ================= QUANTITY ================= */}

            {product.stock > 0 && (
              <div className="quantity-section">

                <label>QUANTITY</label>

                <div className="quantity-box">

                  <button
                    onClick={decreaseQuantity}
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    onClick={increaseQuantity}
                  >
                    +
                  </button>

                </div>
              </div>
            )}

            {/* ================= BUTTONS ================= */}

            <div className="product-actions">

              <button
                className="add-cart-btn"
                onClick={handleAddToCart}
                disabled={
                  product.stock === 0 ||
                  addingToCart
                }
              >
                {addingToCart
                  ? "ADDING..."
                  : product.stock === 0
                  ? "OUT OF STOCK"
                  : "ADD TO CART"}
              </button>

              <button
                className="buy-now-btn"
                onClick={handleBuyNow}
                disabled={
                  product.stock === 0 ||
                  addingToCart
                }
              >
                BUY IT NOW
              </button>

            </div>

            {/* ================= DESCRIPTION ================= */}

            <p className="product-long-description">
              {product.description}
            </p>

          </div>
        </div>

        {/* ================= RELATED PRODUCTS ================= */}

        {relatedProducts.length > 0 && (
          <section className="you-may-like">

            <h2>Find your next favourite</h2>

            <div className="related-products-grid">

              {relatedProducts.map((item) => {

                const relatedPrice =
                  item.salePrice !== null &&
                  item.salePrice !== undefined
                    ? item.salePrice
                    : item.regularPrice;

                return (
                  <div
                    className="related-product-card"
                    key={item._id}
                    onClick={() =>
                      navigate(
                        `/product/${item._id}`
                      )
                    }
                  >

                    <div className="related-image">

                      <img
                        src={
                          item.images?.[0] ||
                          "https://via.placeholder.com/300"
                        }
                        alt={item.name}
                      />

                    </div>

                    <p>{item.name}</p>

                    <span>
                      ₹{" "}
                      {Number(
                        relatedPrice || 0
                      ).toLocaleString("en-IN")}
                    </span>

                  </div>
                );
              })}

            </div>

          </section>
        )}

      </main>

      <Footer />
    </>
  );
}

export default ProductDetails;