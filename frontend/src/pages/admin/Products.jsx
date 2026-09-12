const handleAddToCart = async () => {
  if (product.stock === 0) {
    alert("This product is currently out of stock.");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login to add products to cart.");
    navigate("/login");
    return;
  }

  try {
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

    alert("Product added to cart successfully!");

    navigate("/cart");
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    alert(
      error.message ||
        "Unable to add product to cart."
    );
  }
};