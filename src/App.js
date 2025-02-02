import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

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

// User components
import Header from './Components/User/Header';
import Navbar from './Components/User/Navbar';
import CategoriesDropdown from './Components/User/CategoriesDropdown';
import Signup from './Components/User/SignupForm';
import Login from './Components/User/LoginForm';

// Categories Images & Routes
import Shirts from './Components/User/Menswear/Shirts';
import TShirts from './Components/User/Menswear/TShirt';
import Jeans from './Components/User/Menswear/Jeans';
import Jackets from './Components/User/Menswear/Jackets';
import Dresses from './Components/User/Womenswear/Dresses';
import Tops from './Components/User/Womenswear/Tops';
import Skirts from './Components/User/Womenswear/Skirts';
import Sarees from './Components/User/Womenswear/Sarees';
import KidsTShirts from './Components/User/Kidswear/TShirts';
import Shorts from './Components/User/Kidswear/Shorts';
import KidsDresses from './Components/User/Kidswear/Dresses';
import Nightwear from './Components/User/Kidswear/Nightwear';
import Bags from './Components/User/Accessories/Bags';
import Shoes from './Components/User/Accessories/Shoes';
import Watches from './Components/User/Accessories/Watches';
import Jewelry from './Components/User/Accessories/Jewelry';
import About from './Components/User/About';
import Footer from './Components/User/Footer';
import Home from './Components/User/Home';
import Cart from './Components/User/Cart'
import Checkout from './Components/User/Checkout'
import BelowFooter from './Components/User/BelowFooter';
import UserProfile from './Components/User/UserProfile';
import OrderHistory from './Components/User/OrderHistory';
import PaymentMethod from './Components/User/PaymentMethods';
import ProductOverview from './Components/User/ProductOverview';
import NewArrival from './Components/User/NewArrival';
import SaleProducts from './Components/User/SaleProducts';
import ContactForm from './Components/User/Contact';
function App() {
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

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/admin/login" />;
  };

  return (
    <Router>
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
              <Header />
              <Navbar onToggleDropdown={() => setDropdownOpen(!dropdownOpen)} />
              {dropdownOpen && <CategoriesDropdown onNavigate={handleNavigate} />}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about-us" element={<About />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path='/cart' element={<Cart />}/>
                <Route path='/checkout' element={<Checkout/>}/>
                <Route path='/account'  element={<UserProfile/>}/>
                <Route path='/order-history' element={<OrderHistory/>}/>
                <Route path='/payment-methods' element={<PaymentMethod/>}/>
                <Route path='/product-overview' element={<ProductOverview/>}/>
                <Route path='/newArrivals' element={<NewArrival/>}/>
                <Route path='/sale-products' element={<SaleProducts/>}/>
                <Route path='/contact' element={<ContactForm/>}/>

                {/* Menswear */}
                <Route path="/menswear/shirts" element={<Shirts />} />
                <Route path="/menswear/tshirts" element={<TShirts />} />
                <Route path="/menswear/jeans" element={<Jeans />} />
                <Route path="/menswear/jackets" element={<Jackets />} />

                {/* Womenswear */}
                <Route path="/womenswear/dresses" element={<Dresses />} />
                <Route path="/womenswear/tops" element={<Tops />} />
                <Route path="/womenswear/skirts" element={<Skirts />} />
                <Route path="/womenswear/sarees" element={<Sarees />} />

                {/* Kidswear */}
                <Route path="/kidswear/tshirts" element={<KidsTShirts />} />
                <Route path="/kidswear/shorts" element={<Shorts />} />
                <Route path="/kidswear/dresses" element={<KidsDresses />} />
                <Route path="/kidswear/nightwear" element={<Nightwear />} />

                {/* Accessories */}
                <Route path="/accessories/bags" element={<Bags />} />
                <Route path="/accessories/shoes" element={<Shoes />} />
                <Route path="/accessories/watches" element={<Watches />} />
                <Route path="/accessories/jewelry" element={<Jewelry />} />
              </Routes>
              <Footer />
              <BelowFooter/>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
