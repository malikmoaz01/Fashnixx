import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WomenSwear = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [subsubcategory, setSubsubcategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        
        // Filter for Women's Clothing products only
        const womensProducts = data.filter(product => 
          product.category === "Clothing" && 
          product.subcategory === "Women's Clothing"
        );
        
        setProducts(womensProducts);
        setFilteredProducts(womensProducts);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extract unique subsubcategories for filter
  const subsubcategories = [...new Set(products
    .filter(product => product.subsubcategory && product.subsubcategory !== "None" && product.subsubcategory !== "")
    .map(product => product.subsubcategory))];
  
  // Price brackets for filter
  const priceBrackets = [
    { label: 'All Prices', value: [0, 100000] },
    { label: 'Under Rs1,000', value: [0, 1000] },
    { label: 'Rs1,000 - Rs5,000', value: [1000, 5000] },
    { label: 'Rs5,000 - Rs10,000', value: [5000, 10000] },
    { label: 'Over Rs10,000', value: [10000, 100000] }
  ];

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
    
    // Apply subsubcategory filter (for Dresses, Tops, etc.)
    if (subsubcategory) {
      filtered = filtered.filter(product => product.subsubcategory === subsubcategory);
    }
    
    // Apply price range filter
    filtered = filtered.filter(product => 
      (product.discountPrice || product.price) >= priceRange[0] &&
      (product.discountPrice || product.price) <= priceRange[1]
    );
    
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
  }, [searchQuery, subsubcategory, priceRange, sortOption, products]);

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

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSubsubcategory('');
    setPriceRange([0, 100000]);
    setSortOption('');
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-pink-600">Women's Clothing Collection</h1>
      
      {/* Search Bar */}
      <div className="relative mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search women's clothing..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 pl-10 pr-4 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <svg className="absolute left-3 top-3.5 h-5 w-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <div className="md:hidden mb-4">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="w-full py-2 bg-pink-100 text-pink-600 rounded-md flex items-center justify-center font-medium"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          <svg className={`ml-2 h-5 w-5 transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {/* Filters Section */}
      <div className={`mb-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-pink-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-pink-500 mb-1">Category</label>
              <select
                value={subsubcategory}
                onChange={(e) => setSubsubcategory(e.target.value)}
                className="w-full p-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="">All Categories</option>
                {subsubcategories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Price Range Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-pink-500 mb-1">Price Range</label>
              <select
                value={`${priceRange[0]}-${priceRange[1]}`}
                onChange={(e) => {
                  const values = e.target.value.split('-').map(Number);
                  setPriceRange(values);
                }}
                className="w-full p-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                {priceBrackets.map((bracket, idx) => (
                  <option key={idx} value={`${bracket.value[0]}-${bracket.value[1]}`}>
                    {bracket.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort Options */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-pink-500 mb-1">Sort By</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full p-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="">Recommended</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
            
            {/* Reset Button */}
            <div className="w-full md:w-auto mt-2 md:mt-6">
              <button
                onClick={resetFilters}
                className="w-full md:w-auto px-4 py-2 bg-pink-50 text-pink-600 border border-pink-200 rounded-md hover:bg-pink-100 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        <p>{filteredProducts.length} products found</p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-pink-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-center text-gray-500">No women's clothing products match your search criteria</p>
              <button 
                onClick={resetFilters}
                className="mt-4 px-4 py-2 text-pink-600 hover:text-pink-700 underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const outOfStock = isOutOfStock(product);
              return (
                <div
                  key={product._id}
                  className="relative bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  {/* Out of Stock Badge */}
                  {outOfStock && (
                    <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full z-10">
                      Out of Stock
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden group">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Quick view overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleViewDetails(product._id)}
                        className="bg-white text-pink-600 py-2 px-4 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h2 className="text-lg font-medium text-gray-800 hover:text-pink-600 transition-colors cursor-pointer" onClick={() => handleViewDetails(product._id)}>
                      {product.name}
                    </h2>
                    <p className="text-sm text-pink-500 mt-1">{product.subsubcategory || 'Women\'s Clothing'}</p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-pink-600">
                          Rs{product.discountPrice || product.price}
                        </span>
                        {product.discountPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            Rs{product.price}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <span className="font-medium">{product.rating}★</span>
                      </div>
                    </div>

                  
                    {product.stock && product.stock.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Available Sizes:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.stock
                            .filter(item => item.quantity > 0)
                            .map((item, idx) => (
                              <span key={idx} className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded">
                                {item.size}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                    <button
                      disabled={outOfStock}
                      className={`mt-4 w-full py-2 rounded-md transition-colors ${
                        outOfStock
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-pink-500 hover:bg-pink-600 text-white'
                      }`}
                      onClick={() => handleViewDetails(product._id)}
                    >
                      {outOfStock ? 'Unavailable' : 'View Details'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default WomenSwear;