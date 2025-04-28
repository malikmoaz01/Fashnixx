import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../../assets/Logo.png";

const HeadNav = () => {
  // State management
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [user, setUser] = useState(null);
  const [cartBlink, setCartBlink] = useState(false);
  const [wishlistBlink, setWishlistBlink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [products, setProducts] = useState([]);
  
  // Refs for dropdown management
  const categoryBtnRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const navigate = useNavigate();

  // Categories for dropdown
  const categories = [
    {
      name: 'Men\'s Clothing',
      icon: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z',
      link: '/products/menswear'
    },
    {
      name: 'Women\'s Clothing',
      icon: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z',
      link: '/products/womenswear'
    },
    {
      name: 'Kid\'s Clothing',
      icon: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z',
      link: '/products/kidswear'
    },
    {
      name: 'Men\'s Shoes',
      icon: 'M19.5 14c-1.4 0-2.7.3-4 .8V11c0-1.4-1.1-2.5-2.5-2.5h-7C4.6 8.5 3.5 9.6 3.5 11v7c0 1.4 1.1 2.5 2.5 2.5h7c1.4 0 2.5-1.1 2.5-2.5v-1.2c1.3.5 2.6.8 4 .8 3.3 0 6-2.7 6-6s-2.7-6-6-6z',
      link: '/products/menshoes'
    },
    {
      name: 'Women\'s Shoes',
      icon: 'M19.5 14c-1.4 0-2.7.3-4 .8V11c0-1.4-1.1-2.5-2.5-2.5h-7C4.6 8.5 3.5 9.6 3.5 11v7c0 1.4 1.1 2.5 2.5 2.5h7c1.4 0 2.5-1.1 2.5-2.5v-1.2c1.3.5 2.6.8 4 .8 3.3 0 6-2.7 6-6s-2.7-6-6-6z',
      link: '/products/womenshoes'
    },
    {
      name: 'Accessories',
      icon: 'M17.73 12.02l3.98-3.98c.39-.39.39-1.02 0-1.4l-4.34-4.34c-.39-.39-1.02-.39-1.41 0l-3.98 3.98L8 2.29C7.8 2.1 7.55 2 7.29 2c-.25 0-.51.1-.7.29L2.25 6.63c-.39.39-.39 1.02 0 1.41l3.98 3.98L2.25 16c-.39.39-.39 1.02 0 1.41l4.34 4.34c.39.39 1.02.39 1.41 0l3.98-3.98 3.98 3.98c.2.2.45.29.71.29.26 0 .51-.1.71-.29l4.34-4.34c.39-.39.39-1.02 0-1.41l-3.99-3.98zM12 9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-4.71 1.96L3.66 7.34l3.63-3.63 3.62 3.62-3.62 3.63zM10 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2-4l3.63 3.62-3.63 3.63-3.62-3.63 3.62-3.62z',
      link: '/products/accessories'
    }
  ];

  // Fetch products for search functionality
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchProducts();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) || 
      product.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to 5 results
    
    setSearchResults(filteredProducts);
    setShowSearchResults(true);
  };

  // Handle search result click
  const handleResultClick = (productId) => {
    navigate(`/products/${productId}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  // Load cart, wishlist and user from localStorage
  useEffect(() => {
    // Load user data
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    
    // Load cart items
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
    
    // Load wishlist items
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlistItems(storedWishlist);
    
    // Set up event listeners for storage changes
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const updatedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      const updatedUser = JSON.parse(localStorage.getItem('user'));
      
      // Update state if changes detected
      if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {
        setUser(updatedUser);
      }
      
      if (JSON.stringify(updatedCart) !== JSON.stringify(cartItems)) {
        setCartItems(updatedCart);
        
        if (updatedCart.length > cartItems.length) {
          setCartBlink(true);
          setTimeout(() => setCartBlink(false), 3000);
        }
      }
      
      if (JSON.stringify(updatedWishlist) !== JSON.stringify(wishlistItems)) {
        setWishlistItems(updatedWishlist);
        
        if (updatedWishlist.length > wishlistItems.length) {
          setWishlistBlink(true);
          setTimeout(() => setWishlistBlink(false), 3000);
        }
      }
    };
    
    // Listen for storage changes
    window.addEventListener('storageUpdated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storageUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [cartItems, wishlistItems, user]);

  // Handle click outside to close menus and search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!categoryBtnRef.current?.contains(event.target) && !dropdownRef.current?.contains(event.target)) {
        setCategoriesOpen(false);
      }
      if (!event.target.closest('.mobile-menu-button') && !event.target.closest('.mobile-menu')) {
        setMobileMenuOpen(false);
      }
      if (!searchInputRef.current?.contains(event.target) && !searchResultsRef.current?.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Function to get user initials
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    
    const nameParts = user.name.split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    
    // Dispatch storage updated event
    window.dispatchEvent(new Event('storageUpdated'));
  };

  return (
    <>
      {/* First Order Discount Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-pink-600 text-white text-center py-2 px-4">
        <p className="text-sm md:text-base font-medium animate-pulse">
          🎉 SPECIAL OFFER: Get 20% OFF on your first order with code: FIRST20 🎉
        </p>
      </div>
      
      <div className="sticky top-0 z-30 w-full bg-white shadow-md">
        {/* Upper Header with Logo, Brand, Search and Icons */}
        <header className="mx-auto w-full flex flex-col md:flex-row h-auto md:h-16 max-w-[1200px] items-center justify-between px-5 bg-white md:px-10 border-b border-gray-200 py-3 md:py-0">
          {/* Logo */}
          <Link to="/" className="flex items-center mb-3 md:mb-0">
            <img
              className="cursor-pointer h-[40px] w-auto"
              src={Logo}
              alt="company logo"
            />
            <h1 className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-900 to-pink-500 bg-clip-text text-transparent font-serif">
              Fashniz
            </h1>
          </Link>

          {/* Search Bar */}
          <div className="relative w-full md:w-1/3 mb-3 md:mb-0">
            <form onSubmit={handleSearchSubmit}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full py-2 px-4 pl-10 border border-gray-300 rounded-full focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-400"
              />
              <button type="submit" className="absolute left-3 top-2.5">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div 
                ref={searchResultsRef}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                {searchResults.map(product => (
                  <div 
                    key={product._id}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleResultClick(product._id)}
                  >
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="h-12 w-12 object-cover rounded-md mr-3"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-pink-500">Rs{product.discountPrice || product.price}</p>
                    </div>
                  </div>
                ))}
                <div className="p-2 text-center">
                  <button 
                    onClick={() => {
                      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                      setShowSearchResults(false);
                    }}
                    className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                  >
                    View all results
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Icons Section */}
          <div className="flex gap-6 items-center">
            {/* Wishlist Icon */}
            <div className="relative flex cursor-pointer flex-col items-center justify-center">
              <Link to="/wishlist" className="flex flex-col items-center">
                {wishlistItems.length > 0 && (
                  <span className={`absolute -top-1 -right-1 h-4 w-4 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs ${wishlistBlink ? 'animate-pulse' : ''}`}>
                    {wishlistItems.length}
                  </span>
                )}
                
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={wishlistItems.length > 0 ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={wishlistItems.length > 0 ? "0" : "1.5"}
                  className="h-6 w-6 text-blue-900 hover:text-pink-500 transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                <p className="text-xs">Wishlist</p>
              </Link>
            </div>

            {/* Cart Icon */}
            <div className="relative flex cursor-pointer flex-col items-center justify-center">
              <Link to="/cart" className="flex flex-col items-center">
                {cartItems.length > 0 && (
                  <span className={`absolute -top-1 -right-1 h-4 w-4 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs ${cartBlink ? 'animate-pulse' : ''}`}>
                    {cartItems.length}
                  </span>
                )}
                
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6 text-blue-900 hover:text-pink-500 transition-colors"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs">Cart</p>
              </Link>
            </div>

            {/* Account */}
            <div className="relative flex cursor-pointer flex-col items-center justify-center">
              <div
                onClick={() => {
                  if (user) {
                    navigate("/account");
                  } else {
                    navigate("/signup");
                  }
                }}
                className="flex flex-col items-center"
              >
                {user ? (
                  user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-9 w-9 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-medium">
                      {getUserInitials()}
                    </div>
                  )
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6 text-blue-900 hover:text-pink-500 transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                )}
                <p className="text-xs">Account</p>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Bar */}
        <nav className="bg-blue-900 w-full">
          <div className="mx-auto flex h-12 w-full max-w-[1200px] items-center justify-between px-5 md:px-10">
            <div 
              ref={categoryBtnRef}
              className="relative h-full"
              onMouseEnter={() => setCategoriesOpen(true)}
            >
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex h-full w-32 items-center justify-center bg-pink-500 hover:bg-pink-400 transition-colors md:w-40 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-1 h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                Categories
              </button>
            </div>
            
            <div className="hidden md:flex gap-8">
              <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/newArrivals">New Arrivals</Link>
              <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/">Home</Link>
              <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/about-us">About</Link>
              <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/contact">Contact Us</Link>
            </div>
            
            <div className="hidden md:flex gap-4">
              {user ? (
                <button 
                  className="font-light text-white hover:text-pink-300 hover:underline" 
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              ) : (
                <>
                  <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/login">Login</Link>
                  <span className="text-white">|</span>
                  <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/signup">Sign Up</Link>
                </>
              )}
            </div>
            
            <button 
              className="mobile-menu-button md:hidden text-white" 
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          {categoriesOpen && (
            <div 
              ref={dropdownRef}
              className="absolute w-full left-0 z-40"
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <div className="w-full bg-white shadow-lg border-t border-gray-200 animate-fadeIn">
                <div className="container mx-auto py-6 px-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((category, index) => (
                      <Link
                        key={index}
                        to={category.link}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex flex-col items-center p-4 rounded-lg transition-all duration-300 hover:bg-pink-50 hover:shadow-md group"
                      >
                        <div className="w-16 h-16 flex items-center justify-center bg-pink-100 rounded-full mb-3 group-hover:bg-pink-200 transition-colors">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-8 w-8 text-pink-600" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={category.icon} />
                          </svg>
                        </div>
                        <span className="text-center font-medium text-gray-700 group-hover:text-pink-600">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {mobileMenuOpen && (
            <div className="mobile-menu md:hidden absolute top-28 left-0 w-full bg-blue-900 shadow-lg p-4 flex flex-col items-center text-white z-40">
              <Link className="py-2 hover:text-pink-300" to="/newArrivals" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
              <Link className="py-2 hover:text-pink-300" to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link className="py-2 hover:text-pink-300" to="/about-us" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link className="py-2 hover:text-pink-300" to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
              <hr className="my-2 w-full border-gray-500" />
              {user ? (
                <button 
                  className="py-2 hover:text-pink-300" 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Log Out
                </button>
              ) : (
                <>
                  <Link className="py-2 hover:text-pink-300" to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link className="py-2 hover:text-pink-300" to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default HeadNav;