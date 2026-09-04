import { BrowserRouter, Routes, Route } from "react-router-dom";

// Customer Pages
import ProductDetails from "./pages/ProductDetails";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
import Settings from "./pages/admin/Settings";
import AdminProfile from "./pages/admin/AdminProfile";

import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= CUSTOMER SIDE ================= */}

        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/category" element={<Category />} />

        {/* ================= ADMIN SIDE ================= */}

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        {/* Products */}
        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <Products />
            </AdminLayout>
          }
        />

        {/* Add Product */}
        <Route
          path="/admin/products/add"
          element={
            <AdminLayout>
              <AddProduct />
            </AdminLayout>
          }
        />

        {/* Categories */}
        <Route
          path="/admin/categories"
          element={
            <AdminLayout>
              <Categories />
            </AdminLayout>
          }
        />

        {/* Banners */}
        <Route
          path="/admin/banners"
          element={
            <AdminLayout>
              <Banners />
            </AdminLayout>
          }
        />

        {/* Customers */}
        <Route
          path="/admin/customers"
          element={
            <AdminLayout>
              <Customers />
            </AdminLayout>
          }
        />

        {/* Orders */}
        <Route
          path="/admin/orders"
          element={
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          }
        />

        {/* Order Details */}
        <Route
          path="/admin/orders/:id"
          element={
            <AdminLayout>
              <OrderDetails />
            </AdminLayout>
          }
        />

        {/* Coupons */}
        <Route
          path="/admin/coupons"
          element={
            <AdminLayout>
              <Coupons />
            </AdminLayout>
          }
        />

        {/* Inventory */}
        <Route
          path="/admin/inventory"
          element={
            <AdminLayout>
              <Inventory />
            </AdminLayout>
          }
        />

        {/* Settings */}
        <Route
          path="/admin/settings"
          element={
            <AdminLayout>
              <Settings />
            </AdminLayout>
          }
        />

        {/* Admin Profile */}
        <Route
          path="/admin/profile"
          element={
            <AdminLayout>
              <AdminProfile />
            </AdminLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;