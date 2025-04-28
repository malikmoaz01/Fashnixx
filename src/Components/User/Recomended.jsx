import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Appp.css';

const Recommended = () => {
  const navigate = useNavigate();
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const allProducts = await res.json();
        const recommendedProducts = getRecommendations(allProducts);
        setRecommendedProducts(recommendedProducts);
      } catch (err) {
        console.error('Failed to fetch recommended products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, []);

  // Simulate recommendation models - in a real app this would be an API call
  // This function simulates 3 different recommendation models and combines their results
  const getRecommendations = (products) => {
    if (!products || products.length === 0) return [];
    
    // Model 1: Popularity-based (highest rating × reviews)
    const popularityBased = [...products].sort((a, b) => {
      const scoreA = (a.rating || 0) * (a.reviews || 1);
      const scoreB = (b.rating || 0) * (b.reviews || 1);
      return scoreB - scoreA;
    }).slice(0, 3);
    
    // Model 2: Content-based (newest products)
    const contentBased = [...products].sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }).slice(0, 3);
    
    // Model 3: Price-based (best deals - highest discount percentage)
    const priceBased = [...products].filter(p => p.discountPrice)
      .sort((a, b) => {
        const discountA = (a.price - a.discountPrice) / a.price;
        const discountB = (b.price - b.discountPrice) / b.price;
        return discountB - discountA;
      }).slice(0, 2);
    
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

  // Handle navigate to product detail
  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Calculate discount percentage
  const calculateDiscount = (originalPrice, discountPrice) => {
    if (!discountPrice) return "No Discount";
    const discount = ((originalPrice - discountPrice) / originalPrice) * 100;
    return `${Math.round(discount)}% OFF`;
  };

  return (
    <div className="bg-gray-100 p-6">
      {/* Section Title with Animation */}
      <h2 className="text-left text-4xl font-bold mb-8 pl-4 flex space-x-1">
        {Array.from("Recommendation").map((letter, index) => (
          <span
            key={index}
            className="inline-block animate-color-change"
            style={{
              animationDelay: `${index * 0.2}s`,
              marginRight: letter === " " ? "10px" : "0",
            }}
          >
            {letter}
          </span>
        ))}
      </h2>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <section className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-6 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {recommendedProducts.map((product) => (
            <div
              key={product._id}
              className="flex flex-col rounded-lg overflow-hidden group bg-white shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="relative group">
                <img
                  className="h-64 w-full object-cover rounded-t-lg"
                  src={product.images && product.images[0]}
                  alt={`${product.name} image`}
                />
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleViewDetails(product._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </button>
                </div>
                {product.discountPrice && (
                  <div className="absolute top-2 right-2 bg-pink-400 px-2 py-1 text-xs font-semibold text-white">
                    {calculateDiscount(product.price, product.discountPrice)}
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <p className="text-lg font-semibold text-gray-800">{product.name}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold text-blue-900">
                    Rs. {product.discountPrice || product.price}{' '}
                    {product.discountPrice && (
                      <span className="text-sm font-normal text-gray-400 line-through">
                        Rs. {product.price}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-yellow-400 font-medium">
                    {product.rating} ★ <span className="text-gray-500">({product.reviews || 0})</span>
                  </p>
                </div>

                <div className="text-sm text-gray-600">
                  <div className="flex flex-wrap gap-x-4">
                    {product.material && <p><strong>Material:</strong> {product.material}</p>}
                    {product.color && <p><strong>Color:</strong> {product.color}</p>}
                  </div>
                  {product.availableSizes && (
                    <p><strong>Sizes:</strong> {product.availableSizes.join(', ')}</p>
                  )}
                  {product.stock && product.stock < 5 && (
                    <p className="text-red-700 font-medium animate-pulse mt-1">
                      <strong>Only {product.stock} left!</strong>
                    </p>
                  )}
                </div>

                <button 
                  onClick={() => handleViewDetails(product._id)}
                  className="mt-3 w-full bg-blue-900 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 rounded-full"
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default Recommended;