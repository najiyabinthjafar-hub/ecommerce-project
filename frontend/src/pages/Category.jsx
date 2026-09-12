import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Category.css";

function Category() {
  const { slug, subcategorySlug } = useParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError("");

        // ================= GET CATEGORY TREE =================

        const categoryResponse = await fetch(
          "http://localhost:5000/api/categories/tree"
        );

        const categoryData = await categoryResponse.json();

        if (!categoryResponse.ok) {
          throw new Error(
            categoryData.message || "Failed to fetch categories"
          );
        }

        const allCategories = categoryData.categories || [];

        // ================= FIND PARENT CATEGORY =================

        const foundCategory = allCategories.find(
          (category) => category.slug === slug
        );

        if (!foundCategory) {
          throw new Error("Category not found");
        }

        setCurrentCategory(foundCategory);

        const childCategories = foundCategory.children || [];

        setCategories(childCategories);

        // ================= GET PRODUCTS =================

        const productResponse = await fetch(
          "http://localhost:5000/api/products?limit=100"
        );

        const productData = await productResponse.json();

        if (!productResponse.ok) {
          throw new Error(
            productData.message || "Failed to fetch products"
          );
        }

        const allProducts = productData.products || [];

        // ================= SELECT CATEGORY IDs =================

        let allowedCategoryIds = [];

        // If subcategory selected
        if (subcategorySlug) {
          const selectedSubcategory = childCategories.find(
            (category) => category.slug === subcategorySlug
          );

          if (selectedSubcategory) {
            allowedCategoryIds = [
              String(selectedSubcategory._id),
            ];
          }
        } 
        
        // If no subcategory selected → show all
        else {
          allowedCategoryIds = childCategories.map(
            (category) => String(category._id)
          );
        }

        // ================= FILTER PRODUCTS =================

        const filteredProducts = allProducts.filter((product) => {
          if (product.status !== "active") {
            return false;
          }

          if (!product.category) {
            return false;
          }

          const productCategoryId =
            product.category._id || product.category;

          return allowedCategoryIds.includes(
            String(productCategoryId)
          );
        });

        setProducts(filteredProducts);

      } catch (error) {
        console.error("Category Error:", error);

        setError(error.message);

      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug, subcategorySlug]);

  // ================= LOADING =================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="category-page">
          <p className="category-loading">
            Loading category...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <>
        <Navbar />

        <main className="category-page">
          <p className="category-loading">
            {error}
          </p>
        </main>

        <Footer />
      </>
    );
  }

  // ================= CURRENT TITLE =================

  const selectedSubcategory = categories.find(
    (category) => category.slug === subcategorySlug
  );

  const pageTitle =
    selectedSubcategory?.name || currentCategory?.name;

  return (
    <>
      <Navbar />

      <main className="category-page">

        {/* ================= HEADING ================= */}

        <section className="category-page-heading">

          <h1>New Arrivals</h1>

          <p className="category-page-description">
            Explore our latest collection.
          </p>

        </section>


        {/* ================= SUBCATEGORIES ================= */}

        <section className="subcategory-section">

          <div className="subcategory-list">

            {/* ALL BUTTON */}

            <Link
              to={`/category/${slug}`}
              className={`subcategory-item ${
                !subcategorySlug ? "active" : ""
              }`}
            >
              All
            </Link>


            {/* CATEGORY BUTTONS */}

            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${slug}/${category.slug}`}
                className={`subcategory-item ${
                  subcategorySlug === category.slug
                    ? "active"
                    : ""
                }`}
              >
                {category.name}
              </Link>
            ))}

          </div>

        </section>


        {/* ================= PRODUCTS ================= */}

        <section className="category-page-products">

          <div className="category-page-top">

            <h2>{pageTitle}</h2>

            <p>{products.length} Products</p>

          </div>


          <div className="category-page-grid">

            {products.length > 0 ? (

              products.map((product) => {

                const productId =
                  product._id || product.id;

                let productImage =
                  product.images?.[0] ||
                  product.image ||
                  "";

                // Backend relative image path fix

                if (
                  productImage &&
                  !productImage.startsWith("http")
                ) {
                  productImage = `http://localhost:5000${
                    productImage.startsWith("/")
                      ? ""
                      : "/"
                  }${productImage}`;
                }

                const productPrice =
                  product.salePrice !== null &&
                  product.salePrice !== undefined
                    ? product.salePrice
                    : product.regularPrice;

                return (

                  <Link
                    key={productId}
                    to={`/product/${productId}`}
                    className="category-product-card"
                  >

                    <div className="category-product-image">

                      {product.stock === 0 && (
                        <span className="sold-out">
                          SOLD OUT
                        </span>
                      )}

                      <img
                        src={productImage}
                        alt={product.name}
                      />

                    </div>


                    <div className="category-product-info">

                      <h3>{product.name}</h3>

                      <p className="product-price">
                        ₹{" "}
                        {Number(
                          productPrice || 0
                        ).toLocaleString("en-IN")}
                      </p>

                    </div>

                  </Link>

                );

              })

            ) : (

              <p className="no-category-products">
                No products found in this category.
              </p>

            )}

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Category;