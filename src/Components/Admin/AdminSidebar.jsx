import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import analysisLogo from "../../assets/analysis.png";
import dashboardLogo from "../../assets/dashboard.png";
import ingestionLogo from "../../assets/ingestion.png";
import indicatorLogo from "../../assets/indicator.png";
import libraryLogo from "../../assets/library.png";
import nkLogo from "../../assets/nk.png";
import reportsLogo from "../../assets/reports.png";
import settingsLogo from "../../assets/setting.png";
import Logo from "../../assets/Logo.png";
import gptLogo from '../../assets/gpt.png'


const Sidebar = () => {
  const location = useLocation();
  const elements = [
    { elementName: "Dashboard", elementLogo: dashboardLogo, elementNav: "/admin/dashboard" },
    { elementName: "Product Management", elementLogo: ingestionLogo, elementNav: "/admin/product_management" },
    { elementName: "Order Management", elementLogo: reportsLogo, elementNav: "/admin/order_management" },
    { elementName: "User Management", elementLogo: indicatorLogo, elementNav: "/admin/user_management" },
    { elementName: "Sales Reports", elementLogo: analysisLogo, elementNav: "/admin/sales_reports" },
    { elementName: "Discount Management", elementLogo: libraryLogo, elementNav: "/admin/discount_management" },
    { elementName: "Product Recommendations", elementLogo: gptLogo, elementNav: "/admin/product_recommendation" },
    { elementName: "Shipping Management", elementLogo: nkLogo, elementNav: "/admin/shipping_management" },
    { elementName: "Settings", elementLogo: settingsLogo, elementNav: "/admin/settings" },
  ];

  const [activeElement, setActiveElement] = useState(location.pathname);

  useEffect(() => {
    setActiveElement(location.pathname);
  }, [location.pathname]);

  return (
    <div className="sidebar w-1/5 md:h-[100vh] bg-gradient-to-b from-[#1F2937] to-[#4B5563] sticky top-0 h-[500px]">
      <img src={Logo} alt="Cosmo Logo" className="cosmoImg md:m-3 w-24 md:w-32 h-auto object-contain" />

      <ul className="flex flex-col p-2 items-center md:items-start">
        {elements.map((element, index) => (
          <li
            key={index}
            className={`p-2.5 md:w-full ${activeElement === element.elementNav ? "bg-[#FF7849] text-white font-medium rounded-lg" : ""}`}
          >
            <NavLink
              to={element.elementNav}
              className={`text-sm flex text-center items-center ${activeElement === element.elementNav ? "text-white" : "text-[#9CA3AF]"}`}
            >
              <img src={element.elementLogo} alt={element.elementName} className="mr-2" />
              <p className="md:block hidden">{element.elementName}</p>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
