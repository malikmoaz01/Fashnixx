import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

import ScrollToTop from './Components/User/ScrollToTop';

// Admin components
import HeaderAdmin from './Components/Admin/AdminHeader';
import Sidebar from './Components/Admin/AdminSidebar';
import Dashboard from './Components/Admin/Dashboard';
import ProductManagement from './Components/Admin/ProductManagement';
import OrderManagement from './Components/Admin/OrderManagement';
import UserManagement from './Components/Admin/UserManagement';
import SalesReports from './Components/Admin/SalesReports';
import DiscountManagement from './Components/Admin/DiscountManagement';
import ProductRecommendation from './Components/Admin/ProductRecommendation';
import ShippingManagement from './Components/Admin/ShippingManagement';
import Settings from './Components/Admin/Settings';
import AdminLogin from './Components/Admin/AdminLogin';
import AdminComplain from './Components/Admin/AdminComplains';
import OrderConfirmation from './Components/User/Delivery/OrderConfirmation';

import Headnav from './Components/User/HeadNav';
import Signup from './Components/User/SignupForm';
import Login from './Components/User/LoginForm';
import ProductList from './Components/User/productlist';
import ProductDetail from './Components/User/ProductDetail';
import Wishlist from './Components/User/Wishlist';
import ComplaintChatbot from './Components/User/ComplaintChatbot';
import About from './Components/User/About';
import Footer from './Components/User/Footer';
import Home from './Components/User/Home';
import Cart from './Components/User/Cart';
import Checkout from './Components/User/Checkout';
import BelowFooter from './Components/User/BelowFooter';
import UserProfile from './Components/User/UserProfile';
import OrderHistory from './Components/User/OrderHistory';
import PaymentMethod from './Components/User/PaymentMethods';
import ProductOverview from './Components/User/ProductOverview';
import NewArrival from './Components/User/NewArrival';
import SaleProducts from './Components/User/SaleProducts';
import ContactForm from './Components/User/Contact';

// Categories routes
import MenSwear from './Components/User/Categories/Menswearr';
import WomenSwear from './Components/User/Categories/Womenswear';
import KidsSwear from './Components/User/Categories/Kidswear';
import Accessories from './Components/User/Categories/Accessories';
import Menshoes from './Components/User/Categories/Menshoes';
import Womenshoes from './Components/User/Categories/Womenshoes';

function App() {
  const GOOGLE_CLIENT_ID = "123922841654-i1jujo69c525uji333d5q2v8rksq5est.apps.googleusercontent.com";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const adminCredentials = {
    username: 'admin',
    password: '123',
  };

  const handleLogin = (username, password) => {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleNavigate = () => {
    setDropdownOpen(false);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              isAuthenticated ? (
                <div className="flex">
                  <Sidebar />
                  <div className="flex flex-1 flex-col">
                    <HeaderAdmin onLogout={handleLogout} />
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="product_management" element={<ProductManagement />} />
                      <Route path="order_management" element={<OrderManagement />} />
                      <Route path="user_management" element={<UserManagement />} />
                      <Route path="sales_reports" element={<SalesReports />} />
                      <Route path="discount_management" element={<DiscountManagement />} />
                      <Route path="product_recommendation" element={<ProductRecommendation />} />
                      <Route path="shipping_management" element={<ShippingManagement />} />
                      <Route path="admin_complain" element={<AdminComplain />} />
                      <Route path="settings" element={<Settings />} />
                    </Routes>
                  </div>
                </div>
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
          <Route path="/admin/login" element={<AdminLogin onLogin={handleLogin} />} />

          {/* User routes */}
          <Route
            path="/*"
            element={
              <>
                <Headnav/>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about-us" element={<About />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path='/cart' element={<Cart />} />
                  <Route path='/wishlist' element={<Wishlist />} />
                  <Route path='/checkout' element={<Checkout />} />
                  <Route path='/account' element={<UserProfile />} />
                  <Route path='/order-history' element={<OrderHistory />} />
                  <Route path='/account/payment-methods' element={<PaymentMethod />} />
                  <Route path='/product-overview' element={<ProductOverview />} />
                  <Route path='/newArrivals' element={<NewArrival />} />
                  <Route path='/sale-products' element={<SaleProducts />} />
                  <Route path='/contact' element={<ContactForm />} />
                  <Route path='/products' element={<ProductList />} />
                  <Route path="/products/:productId" element={<ProductDetail />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/orders/:orderId" element={<OrderConfirmation />} />
                  <Route path='/products/menswear' element={<MenSwear />} />
                  <Route path='/products/womenswear' element={<WomenSwear />} />
                  <Route path='/products/kidswear' element={<KidsSwear />} />
                  <Route path='/products/accessories' element={<Accessories />} />
                  <Route path='/products/menshoes' element={<Menshoes />} />
                  <Route path='/products/womenshoes' element={<Womenshoes />} />
                </Routes>
                <Footer />
                <BelowFooter />
                <ComplaintChatbot />
              </>
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;