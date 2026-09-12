require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addressRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const couponRoutes = require("./routes/couponRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// ===============================
// DATABASE
// ===============================
connectDB();

// ===============================
// CORS
// ===============================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ===============================
// MIDDLEWARE
// ===============================
app.use(express.json());

// ===============================
// TEST ROUTE
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-Commerce API is running",
  });
});

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/addresses", addressRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/banners", bannerRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/coupons", couponRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});