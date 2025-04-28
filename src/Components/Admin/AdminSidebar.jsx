import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";
// Lucide icons for sidebar items
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart, 
  Tags, 
  MessageSquare, 
  Truck, 
  MessageCircleWarning, 
  Settings 
} from "lucide-react";
import Logo from "../../assets/Logo.png";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const elements = [
    { elementName: "Dashboard", icon: <LayoutDashboard size={22} />, elementNav: "/admin/dashboard" },
    { elementName: "Product Management", icon: <Package size={22} />, elementNav: "/admin/product_management" },
    { elementName: "Order Management", icon: <ShoppingCart size={22} />, elementNav: "/admin/order_management" },
    { elementName: "User Management", icon: <Users size={22} />, elementNav: "/admin/user_management" },
    { elementName: "Sales Reports", icon: <BarChart size={22} />, elementNav: "/admin/sales_reports" },
    { elementName: "Discount Management", icon: <Tags size={22} />, elementNav: "/admin/discount_management" },
    { elementName: "Recommendations", icon: <MessageSquare size={22} />, elementNav: "/admin/product_recommendation" },
    { elementName: "Shipping Management", icon: <Truck size={22} />, elementNav: "/admin/shipping_management" },
    { elementName: "Complaints", icon: <MessageCircleWarning size={22} />, elementNav: "/admin/admin_complain" },
  ];

  const [activeElement, setActiveElement] = useState(location.pathname);

  useEffect(() => {
    setActiveElement(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        onClick={toggleSidebar} 
        className="md:hidden fixed top-4 left-4 z-30 bg-gray-800 p-2 rounded-md text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`transition-all duration-300 fixed md:sticky top-0 left-0 h-screen z-20 bg-gradient-to-b from-[#1F2937] to-[#4B5563] ${
          isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-20 md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex justify-center py-6">
            <img 
              src={Logo} 
              alt="Cosmo Logo" 
              className={`transition-all ${isOpen ? "w-36" : "w-12 md:w-16"} h-auto object-contain`}
            />
          </div>

          {/* Navigation */}
          <ul className="flex flex-col space-y-2 px-3 overflow-y-auto flex-grow">
            {elements.map((element, index) => (
              <li key={index}>
                <NavLink
                  to={element.elementNav}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 group hover:bg-gray-700 ${
                    activeElement === element.elementNav ? "bg-[#FF7849] text-white" : "text-[#9CA3AF]"
                  }`}
                >
                  <div className="flex-shrink-0 text-current">
                    {element.icon}
                  </div>
                  <span 
                    className={`ml-3 transition-opacity ${
                      isOpen ? "opacity-100" : "opacity-0 md:hidden"
                    } whitespace-nowrap`}
                  >
                    {element.elementName}
                  </span>
                  {!isOpen && (
                    <div className="fixed left-20 ml-6 scale-0 rounded bg-gray-800 px-2 py-1 text-sm text-white group-hover:scale-100 z-50 hidden md:block">
                      {element.elementName}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Toggle button for desktop */}
          <div className="hidden md:flex justify-center p-4">
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <ChevronRight 
                className={`w-5 h-5 text-white transition-transform ${isOpen ? "rotate-180" : ""}`} 
              />
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;