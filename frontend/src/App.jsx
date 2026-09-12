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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import BestSellersPage from "./pages/BestSellersPage";
import Category from "./pages/Category";
import VerifyOtp from "./pages/VerifyOtp";
import Wishlist from "./pages/Wishlist";
import CategoriesPage from "./pages/CategoriesPage";

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