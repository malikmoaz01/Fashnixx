import React, { useState, useEffect } from 'react';

const ProductRecommendationDashboard = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState(null);
  
  // Define recommendation strategy categories
  const strategies = [
    { id: 'all', name: 'All Recommendations' },
    { id: 'popular', name: 'Popularity-based' },
    { id: 'content', name: 'Content-based' },
    { id: 'price', name: 'Best Deals' }
  ];

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }
        const allProducts = await res.json();
        
        // Process recommendations
        const recommendations = getRecommendations(allProducts);
        setRecommendedProducts(recommendations);
      } catch (err) {
        console.error('Failed to fetch recommended products:', err);
        setError('Failed to load product recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, []);

  // Filtering logic for products based on search and active tab
  const filteredProducts = recommendedProducts.filter(product => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.material && product.material.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.color && product.color.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Tab filter
    const matchesTab = activeTab === 'all' || product.recommendationType === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Recommendation logic - sorts and categorizes products
  const getRecommendations = (products) => {
    if (!products || products.length === 0) return [];
    
    // Model 1: Popularity-based (highest rating × reviews)
    const popularityBased = [...products]
      .sort((a, b) => {
        const scoreA = (a.rating || 0) * (a.reviews || 1);
        const scoreB = (b.rating || 0) * (b.reviews || 1);
        return scoreB - scoreA;
      })
      .slice(0, 3)
      .map(product => ({ ...product, recommendationType: 'popular' }));
    
    // Model 2: Content-based (newest products)
    const contentBased = [...products]
      .sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      })
      .slice(0, 3)
      .map(product => ({ ...product, recommendationType: 'content' }));
    
    // Model 3: Price-based (best deals - highest discount percentage)
    const priceBased = [...products]
      .filter(p => p.discountPrice)
      .sort((a, b) => {
        const discountA = (a.price - a.discountPrice) / a.price;
        const discountB = (b.price - b.discountPrice) / b.price;
        return discountB - discountA;
      })
      .slice(0, 2)
      .map(product => ({ ...product, recommendationType: 'price' }));
    
    // Combine recommendations, remove duplicates, and limit to 8 products
    const combined = [...popularityBased, ...contentBased, ...priceBased];
    const uniqueProductIds = new Set();
    const uniqueRecommendations = combined.filter(product => {
      if (uniqueProductIds.has(product._id)) return false;
      uniqueProductIds.add(product._id);
      return true;
    }).slice(0, 8);
    
    return uniqueRecommendations;
  };

  // Calculate discount percentage
  const calculateDiscount = (originalPrice, discountPrice) => {
    if (!discountPrice) return null;
    const discount = ((originalPrice - discountPrice) / originalPrice) * 100;
    return `${Math.round(discount)}% OFF`;
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Highlight search terms in text
  const highlightText = (text) => {
    if (!searchTerm || !text) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-pink-500 text-white">{part}</span>
      ) : part
    );
  };

  return (
    <div className="bg-gradient-to-b from-blue-900 to-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-6">Product Recommendation Dashboard</h2>
        
        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-pink-500 focus:outline-none"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto w-full md:w-auto">
            {strategies.map(strategy => (
              <button
                key={strategy.id}
                onClick={() => setActiveTab(strategy.id)}
                className={`px-4 py-2 rounded-md whitespace-nowrap ${
                  activeTab === strategy.id
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {strategy.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Products Display */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 text-white p-4 rounded-md text-center">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-white py-10">
            <p className="text-lg">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="flex flex-col rounded-lg overflow-hidden group bg-gray-800 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <div className="relative group h-64">
                  {product.images && product.images[0] ? (
                    <img
                      className="h-full w-full object-cover"
                      src={product.images[0]}
                      alt={`${product.name} image`}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-700">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </button>
                  </div>
                  
                  {product.discountPrice && (
                    <div className="absolute top-2 right-2 bg-pink-500 px-2 py-1 text-xs font-semibold text-white rounded">
                      {calculateDiscount(product.price, product.discountPrice)}
                    </div>
                  )}
                  
                  {/* Recommendation type badge */}
                  <div className="absolute top-2 left-2">
                    {product.recommendationType === 'popular' && (
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Popular
                      </div>
                    )}
                    {product.recommendationType === 'content' && (
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                        New
                      </div>
                    )}
                    {product.recommendationType === 'price' && (
                      <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                        Deal
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-grow">
                  <p className="text-lg font-semibold text-white">
                    {highlightText(product.name)}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold text-pink-400">
                      Rs{product.discountPrice || product.price}{' '}
                      {product.discountPrice && (
                        <span className="text-sm font-normal text-gray-400 line-through">
                          ₹{product.price}
                        </span>
                      )}
                    </p>
                    {/* Rating display */}
                    <p className="text-sm text-yellow-400 font-medium">
                      {product.rating} ★ <span className="text-gray-400">({product.reviews || 0})</span>
                    </p>
                  </div>

                  <div className="text-sm text-gray-300">
                    <div className="flex flex-wrap gap-x-4">
                      {product.material && (
                        <p><strong>Material:</strong> {highlightText(product.material)}</p>
                      )}
                      {product.color && (
                        <p><strong>Color:</strong> {highlightText(product.color)}</p>
                      )}
                    </div>
                    {product.availableSizes && (
                      <p><strong>Sizes:</strong> {product.availableSizes.join(', ')}</p>
                    )}
                    {product.stock && product.stock < 5 && (
                      <p className="text-red-400 font-medium animate-pulse mt-1">
                        <strong>Only {product.stock} left!</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Analytics Summary */}
        {!loading && !error && recommendedProducts.length > 0 && (
          <div className="mt-12 p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Recommendation Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-900 rounded-lg">
                <p className="text-blue-300 text-sm">Popularity-based</p>
                <p className="text-white text-2xl font-bold">
                  {recommendedProducts.filter(p => p.recommendationType === 'popular').length}
                </p>
              </div>
              <div className="p-4 bg-green-900 rounded-lg">
                <p className="text-green-300 text-sm">Content-based</p>
                <p className="text-white text-2xl font-bold">
                  {recommendedProducts.filter(p => p.recommendationType === 'content').length}
                </p>
              </div>
              <div className="p-4 bg-orange-900 rounded-lg">
                <p className="text-orange-300 text-sm">Price-based</p>
                <p className="text-white text-2xl font-bold">
                  {recommendedProducts.filter(p => p.recommendationType === 'price').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRecommendationDashboard;