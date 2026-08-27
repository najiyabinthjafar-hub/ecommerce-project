const express = require("express");
const cors = require("cors");
require("dotenv").config();

const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "E-Commerce Backend is running",
  });
});

// Cart routes
app.use("/api/cart", cartRoutes);

// Wishlist routes
app.use("/api/wishlist", wishlistRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});