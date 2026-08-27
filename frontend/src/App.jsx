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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Customer Side */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        {/* Admin Side */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />

        <Route path="/admin/products" element={<Products />} />

        <Route
          path="/admin/products/add"
          element={<AddProduct />}
        />

        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/banners" element={<Banners />} />
        <Route path="/admin/customers" element={<Customers />} />

        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/coupons" element={<Coupons />} />
        <Route path="/admin/inventory" element={<Inventory />} />


        <Route
          path="/admin/orders/:id"
          element={<OrderDetails />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;