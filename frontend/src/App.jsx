import { BrowserRouter, Routes, Route } from "react-router-dom";

// ================= CUSTOMER PAGES =================
import ProductDetails from "./pages/ProductDetails";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PersonalInformation from "./pages/PersonalInformation";
import Addresses from "./pages/Addresses";
import ChangePassword from "./pages/ChangePassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import BestSellersPage from "./pages/BestSellersPage";
import Category from "./pages/Category";
import VerifyOtp from "./pages/VerifyOtp";
import Wishlist from "./pages/Wishlist";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// ================= FOOTER PAGES =================
import Support from "./pages/Support";
import Invoicing from "./pages/Invoicing";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import FAQs from "./pages/FAQs";

// ================= POLICY PAGES =================
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// ================= ADMIN PAGES =================
import AdminLogin from "./pages/admin/AdminLogin";
import AdminForgotPassword from "./pages/admin/ForgotPassword/ForgotPassword";
import AdminResetPassword from "./pages/admin/ForgotPassword/ResetPassword";
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

import AddBanner from "./pages/admin/AddBanner";
import EditBanner from "./pages/admin/EditBanner";
import EditProduct from "./pages/admin/EditProduct";
import ViewProduct from "./pages/admin/ViewProduct";
import BannerView from "./pages/admin/BannerView";
import AddCoupon from "./pages/admin/AddCoupon";
import ViewCoupon from "./pages/admin/ViewCoupon";

import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";

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

        {/* ================= PROFILE ================= */}

        <Route path="/profile" element={<Profile />} />

        <Route
          path="/profile/personal"
          element={<PersonalInformation />}
        />

        <Route
          path="/profile/addresses"
          element={<Addresses />}
        />

        <Route
          path="/profile/change-password"
          element={<ChangePassword />}
        />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* ================= OTHER CUSTOMER PAGES ================= */}

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route
          path="/new-arrivals"
          element={<NewArrivalsPage />}
        />

        <Route
          path="/best-sellers"
          element={<BestSellersPage />}
        />

        <Route path="/category" element={<Category />} />

        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

        {/* ================= FOOTER PAGES ================= */}

        <Route path="/support" element={<Support />} />

        <Route path="/invoicing" element={<Invoicing />} />

        <Route path="/careers" element={<Careers />} />

        <Route path="/blog" element={<Blog />} />

        <Route path="/faqs" element={<FAQs />} />

        {/* ================= POLICY PAGES ================= */}

        <Route
          path="/refund-policy"
          element={<RefundPolicy />}
        />

        <Route
          path="/shipping-policy"
          element={<ShippingPolicy />}
        />

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms-of-service"
          element={<TermsOfService />}
        />

        {/* ================= ADMIN LOGIN ================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />
         <Route
  path="/admin/forgot-password"
  element={<AdminForgotPassword />}
/>

<Route
  path="/admin/reset-password"
  element={<AdminResetPassword />}
/>

        {/* ================= PROTECTED ADMIN SIDE ================= */}

        <Route element={<ProtectedRoute />}>

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

          {/* Edit Product */}
          <Route
            path="/admin/products/edit/:id"
            element={
              <AdminLayout>
                <EditProduct />
              </AdminLayout>
            }
          />

          {/* View Product */}
          <Route
            path="/admin/products/view/:id"
            element={
              <AdminLayout>
                <ViewProduct />
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

          {/* Add Banner */}
          <Route
            path="/admin/banners/add"
            element={
              <AdminLayout>
                <AddBanner />
              </AdminLayout>
            }
          />

          {/* Edit Banner */}
          <Route
            path="/admin/banners/edit/:id"
            element={
              <AdminLayout>
                <EditBanner />
              </AdminLayout>
            }
          />

          {/* View Banner */}
          <Route
            path="/admin/banners/view/:id"
            element={
              <AdminLayout>
                <BannerView />
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

          {/* Add Coupon */}
          <Route
            path="/admin/coupons/add"
            element={
              <AdminLayout>
                <AddCoupon />
              </AdminLayout>
            }
          />
              {/* View Coupon */}
<Route
  path="/admin/coupons/view/:id"
  element={
    <AdminLayout>
      <ViewCoupon />
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

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;