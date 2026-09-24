require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// =========================
// Models
// =========================

require("./models/Category");
require("./models/Product");

// =========================
// Routes
// =========================

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
const checkoutRoutes = require("./routes/checkoutRoutes");
const adminTestRoutes = require("./routes/adminTestRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Dashboard
const dashboardRoutes = require("./routes/dashboardRoutes");

// Notifications
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// =========================
// DATABASE
// =========================

connectDB();

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// =========================
// API ROUTES
// =========================

// Authentication & User
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);

// Product & Catalog
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);

// Customer Features
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);

// Orders & Payment
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/checkout", checkoutRoutes);

// Admin
app.use("/api/admin", adminTestRoutes);
app.use("/api/admin", adminRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Contact
app.use("/api/contacts", contactRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);

// =========================
// ROOT ROUTE
// =========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-Commerce Backend API is running",
  });
});

// =========================
// 404 ROUTE
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// =========================
// ERROR HANDLER
// =========================

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});