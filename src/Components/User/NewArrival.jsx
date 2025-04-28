import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NewArrival = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Define what "new arrival" means (e.g., products added in the last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        
        // Filter products to only show those created in the last 6 months
        const newArrivals = data.filter(product => {
          const productDate = new Date(product.createdAt);
          return productDate >= sixMonthsAgo;
        });
        
        setProducts(newArrivals);
        setFilteredProducts(newArrivals);
      } catch (err) {
        console.error('Failed to fetch new arrivals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [...new Set(products.map(product => product.category))];

  useEffect(() => {
    // Filter products
    let filtered = [...products];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Apply sorting
    if (sortOption === 'price-low-high') {
      filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortOption === 'price-high-low') {
      filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortOption === 'name-a-z') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-z-a') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, sortOption, products]);

  // Function to check if product is out of stock
  const isOutOfStock = (product) => {
    if (typeof product.stock === 'number') {
      return product.stock === 0;
    }
    
    if (Array.isArray(product.stock)) {
      return product.stock.every(item => item.quantity === 0);
    }
    
    return false;
  };

  // Handle navigate to product detail
  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortOption('newest');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 p-4 md:p-6">
      {/* Header with sparkling effect */}
      <div className="relative mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500">
          New Arrivals
        </h1>
        <div className="w-24 h-1 mx-auto bg-gradient-to-r from-blue-400 to-pink-400 rounded-full"></div>
        
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Discover our latest collection of products added in the last 6 months. 
          Stay ahead of trends with our freshest styles and newest releases.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search new arrivals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 pr-4 border-2 border-blue-300 focus:border-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-300 bg-white shadow-sm"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Toggle Filters Button (Mobile) */}
          <div className="md:hidden">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-md flex items-center justify-center font-medium shadow-md"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              <svg className={`ml-2 h-5 w-5 transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {/* Desktop Filters */}
          <div className={`md:flex gap-4 items-center ${showFilters ? 'flex flex-col' : 'hidden'}`}>
            {/* Category Filter */}
            <div className="w-full md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort Options */}
            <div className="w-full md:w-48">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full p-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>
            
            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-blue-400 to-pink-400 text-white rounded-md hover:from-blue-500 hover:to-pink-500 transition-all shadow-md"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="max-w-7xl mx-auto mb-6">
        <p className="text-gray-600 font-medium">
          {filteredProducts.length} new arrivals found
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

      {/* Product Grid */}
      {!loading && (
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
              <svg className="w-20 h-20 text-blue-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-center text-gray-500 text-lg">No new arrivals match your search criteria</p>
              <button 
                onClick={resetFilters}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-400 to-pink-400 text-white rounded-full shadow-md hover:shadow-lg transition-all"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const outOfStock = isOutOfStock(product);
                const isVeryNew = new Date(product.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Added in last 30 days
                
                return (
                  <div
                    key={product._id}
                    className="relative bg-white rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-md border border-blue-100"
                  >
                    {/* Badges */}
                    <div className="absolute top-0 left-0 right-0 flex justify-between p-2 z-10">
                      {/* New Badge */}
                      {isVeryNew && (
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          NEW
                        </div>
                      )}
                      
                      {/* Out of Stock Badge */}
                      {outOfStock && (
                        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md ml-auto">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    

                    {/* Product Image */}
                    <div className="relative w-full h-56 bg-gradient-to-br from-blue-50 to-pink-50 overflow-hidden group">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Quick view overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleViewDetails(product._id)}
                          className="bg-white text-blue-600 py-3 px-6 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:bg-blue-50"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2" onClick={() => handleViewDetails(product._id)}>
                          {product.name}
                        </h2>
                        <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                          <span className="text-sm font-bold text-yellow-700">{product.rating}★</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-blue-500 font-medium mb-3">{product.category}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">
                            Rs{product.discountPrice || product.price}
                          </span>
                          {product.discountPrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              Rs{product.price}
                            </span>
                          )}
                        </div>
                        
                        {product.discountPrice && (
                          <div className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-1 rounded-full">
                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                          </div>
                        )}
                      </div>

                      <button
                        disabled={outOfStock}
                        className={`w-full py-3 rounded-lg transition-all font-bold shadow-md ${
                          outOfStock
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white'
                        }`}
                        onClick={() => handleViewDetails(product._id)}
                      >
                        {outOfStock ? 'Unavailable' : 'View Details'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      
      {/* Promotional Banner */}
      {filteredProducts.length > 0 && !loading && (
        <div className="max-w-7xl mx-auto mt-12 bg-gradient-to-r from-blue-600 to-pink-600 rounded-xl overflow-hidden shadow-lg">
          <div className="p-6 md:p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Limited Time Offer!</h2>
            <p className="mb-4">Get 10% off on all new arrivals with code: NEWSTYLE10</p>
            <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-2 px-6 rounded-full transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewArrival;