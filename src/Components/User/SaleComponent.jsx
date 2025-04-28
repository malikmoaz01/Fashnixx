import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const SaleComponent = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 21,
    minutes: 23,
    seconds: 12,
  });
  const [saleProducts, setSaleProducts] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        
        // Filter products that are on sale (assuming products with discountPrice are on sale)
        // You can modify this filter based on your actual data structure
        const onSaleProducts = data.filter(product => product.discountPrice);
        
        // Take first 9 sale products or all if less than 9
        setSaleProducts(onSaleProducts.slice(0, 9));
      } catch (err) {
        console.error('Failed to fetch sale products:', err);
      }
    };

    fetchSaleProducts();
  }, []);

  // Countdown Timer Logic
  useEffect(() => {
    const countdownDate = new Date().getTime() + 3600000; // 1 hour from now

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      if (distance < 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle navigate to product detail - same as in ProductList
  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Calculate discount percentage
  const calculateDiscount = (originalPrice, discountPrice) => {
    const discount = ((originalPrice - discountPrice) / originalPrice) * 100;
    return `${Math.round(discount)}% OFF`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="text-4xl font-semibold text-blue-700 animate-blink mb-4 md:mb-0">
          🔥 Flash Sale
        </div>

        {/* Countdown Timer */}
        <div className="text-center text-pink-500 text-2xl font-extrabold shadow-lg rounded-xl p-4 bg-white">
          <h1>{timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s</h1>
        </div>
      </div>

      {/* Flash Sale Timer Animation (Blinking) */}
      <style jsx>{`
        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-blink {
          animation: blink 1s linear infinite;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-256px * ${saleProducts.length / 2}));
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
          display: flex;
        }
      `}</style>

      {/* Product Carousel */}
      <div className="overflow-hidden my-8">
        {saleProducts.length > 0 ? (
          <div className="flex animate-marquee">
            {/* First copy of products for infinite scroll effect */}
            {saleProducts.map((product) => (
              <div
                key={`first-${product._id}`}
                className="flex-none w-64 bg-white p-4 rounded-lg shadow-md mx-2 mb-4 transition-all hover:shadow-lg"
              >
                <div className="relative w-full h-56 bg-gray-100 overflow-hidden group">
                  <img
                    src={product.images && product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Quick view overlay - same as ProductList */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleViewDetails(product._id)}
                      className="bg-white text-pink-600 py-2 px-4 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
                
                <div className="text-center mt-2">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p className="text-gray-500">{product.category}</p>
                  <div className="flex justify-center items-center space-x-2">
                    <span className="text-xl text-red-600 font-semibold">
                      Rs {product.discountPrice}
                    </span>
                    <span className="text-sm line-through text-gray-400">
                      Rs {product.price}
                    </span>
                    <span className="text-sm text-green-500">
                      {calculateDiscount(product.price, product.discountPrice)}
                    </span>
                  </div>
                  <div className="flex justify-center items-center my-2">
                    <span className="text-yellow-400">{product.rating} ★</span>
                    <span className="text-gray-500 ml-2">({product.reviews || 0} reviews)</span>
                  </div>
                </div>

                {/* View Product Button */}
                <div className="flex justify-center my-3">
                  <button 
                    onClick={() => handleViewDetails(product._id)}
                    className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    View Product
                  </button>
                </div>
              </div>
            ))}
            
            {/* Second copy of products for infinite scroll effect */}
            {saleProducts.map((product) => (
              <div
                key={`second-${product._id}`}
                className="flex-none w-64 bg-white p-4 rounded-lg shadow-md mx-2 mb-4 transition-all hover:shadow-lg"
              >
                <div className="relative w-full h-56 bg-gray-100 overflow-hidden group">
                  <img
                    src={product.images && product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
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
                
                <div className="text-center mt-2">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p className="text-gray-500">{product.category}</p>
                  <div className="flex justify-center items-center space-x-2">
                    <span className="text-xl text-red-600 font-semibold">
                      Rs {product.discountPrice}
                    </span>
                    <span className="text-sm line-through text-gray-400">
                      Rs {product.price}
                    </span>
                    <span className="text-sm text-green-500">
                      {calculateDiscount(product.price, product.discountPrice)}
                    </span>
                  </div>
                  <div className="flex justify-center items-center my-2">
                    <span className="text-yellow-400">{product.rating} ★</span>
                    <span className="text-gray-500 ml-2">({product.reviews || 0} reviews)</span>
                  </div>
                </div>

                {/* View Product Button */}
                <div className="flex justify-center my-3">
                  <button 
                    onClick={() => handleViewDetails(product._id)}
                    className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading sale products...</p>
          </div>
        )}
      </div>

      {/* View All Flash Sale Products Button */}
      <div className="flex justify-center my-6">
        <button 
          onClick={() => navigate('/products')}
          className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
        >
          View All Flash Sale Products
        </button>
      </div>
    </div>
  );
};

export default SaleComponent;