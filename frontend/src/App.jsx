import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProductDetails from "./pages/ProductDetails";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import Category from "./pages/Category";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import AddProduct from "./pages/admin/AddProduct";
import Banners from "./pages/admin/Banners";
import Customers from "./pages/admin/Customers";
import AdminOrders from "./pages/admin/Orders";
import OrderDetails from "./pages/admin/OrderDetails";
import Coupons from "./pages/admin/Coupons";
import Inventory from "./pages/admin/Inventory";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            Customer Side
        ========================= */}

        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route path="/cart" element={<Cart />} />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/new-arrivals"
          element={<NewArrivalsPage />}
        />

        <Route
          path="/category"
          element={<Category />}
        />


        {/* =========================
            Admin Side
        ========================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/admin/products"
          element={<Products />}
        />

        <Route
          path="/admin/products/add"
          element={<AddProduct />}
        />

        <Route
          path="/admin/categories"
          element={<Categories />}
        />

        <Route
          path="/admin/banners"
          element={<Banners />}
        />

        <Route
          path="/admin/customers"
          element={<Customers />}
        />

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />

        <Route
          path="/admin/orders/:id"
          element={<OrderDetails />}
        />

        <Route
          path="/admin/coupons"
          element={<Coupons />}
        />

        <Route
          path="/admin/inventory"
          element={<Inventory />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;