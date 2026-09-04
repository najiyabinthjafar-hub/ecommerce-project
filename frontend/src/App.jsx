import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";

import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import AddProduct from "./pages/admin/AddProduct";
import Banners from "./pages/admin/Banners";
import Customers from "./pages/admin/Customers";
import Orders from "./pages/admin/Orders";
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

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        {/* ================= ADMIN SIDE ================= */}

        {/* Admin Login - No Sidebar/Navbar */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

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
              <Orders />
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