const express = require("express");
const cors = require("cors");
require("dotenv").config();

const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const couponRoutes = require("./routes/couponRoutes");
const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "E-Commerce Backend is running",
  });
});


app.use("/api/cart", cartRoutes);


app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});