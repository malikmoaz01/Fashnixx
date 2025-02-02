import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchLogo from '../../assets/search.png';
import alertLogo from '../../assets/alert.png';
import messageLogo from '../../assets/message.png';
import captureLogo from '../../assets/camera.png';

const Header = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeResult, setActiveResult] = useState(null);  
  const navigate = useNavigate();

  const pages = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Product Management', path: '/admin/product_management' },
    { name: 'Order Management', path: '/admin/order_management' },
    { name: 'User Management', path: '/admin/user_management' },
    { name: 'Sales Reports', path: '/admin/sales_reports' },
    { name: 'Discount Management', path: '/admin/discount_management' },
    { name: 'Product Recommendation', path: '/admin/product_recommendation' },
    { name: 'Shipping Management', path: '/admin/shipping_management' },
    { name: 'Settings', path: '/admin/settings' },
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setSearchResults([]);
      return;
    }
    const filteredResults = pages.filter(page =>
      page.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  const handleSearchClick = (path) => {
    setSearchTerm('');
    setSearchResults([]);
    navigate(path);
  };

  const handleMouseEnter = (index) => {
    setActiveResult(index); 
  };

  const handleMouseLeave = () => {
    setActiveResult(null); 
  };

  return (
    <div className='header h-1/7 w-full flex justify-between bg-gradient-to-b from-[#1F2937] to-[#4B5563] sticky top-0'>
      <div className="left m-5 p-1 md:h-10 md:w-72 flex items-center gap-2 border border-solid border-[#374151] rounded-lg">
        <img src={searchLogo} alt="Search Icon" className='md:w-6 md:h-6 w-3 h-3'/>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder='Type to Search...'
          className='md:h-8 flex-1 md:text-base text-[#9CA3AF] font-light outline-none bg-transparent' 
        />
      </div>
      {searchResults.length > 0 && (
        <div className="search-results absolute bg-white w-full border border-t-0 border-[#374151] rounded-b-lg"
             style={{
               top: '50px', 
               zIndex: 10 
             }}>
          <ul>
            {searchResults.map((result, index) => (
              <li
                key={index}
                onClick={() => handleSearchClick(result.path)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave} 
                className={`p-2 cursor-pointer hover:bg-[#FF7849] ${
                  activeResult === index ? 'bg-[#FF7849] text-[#F9FAFB]' : ''
                }`} 
              >
                {result.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="right hidden md:flex m-5 h-[5svh] gap-6 items-center">
        <img src={alertLogo} alt="Alert Logo" className='w-6 h-6' />
        <img src={messageLogo} alt="Message Logo" className='w-6 h-6' />
        <img src={captureLogo} alt="Capture Logo" className='w-6 h-6' />
      </div>
      <div className='m-5 flex gap-2'>
        <button 
          className="bg-transparent hover:bg-[#FF7849] text-[#F9FAFB] font-semibold py-2 px-4 border border-[#FF7849] rounded-full"
          onClick={onLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Header;
