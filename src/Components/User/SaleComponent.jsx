import React, { useState, useEffect } from "react";
import womenDressImg from "../../assets/Sneakers.jpg"; // Your image
import CasioWatch from '../../assets/Sales/Casio-Watch.jpg'
import CoupleSuit from '../../assets/Sales/Couple-Suit.jpg'
import GoldenWomenCasual from '../../assets/Sales/Golden-Shirt.png'
import RolexWatch from '../../assets/Sales/Rolex-Watch.jpg'
import ShalwarQameez from '../../assets/Sales/Shalwar-Qameez.jpg'
import PinkSunglasses from '../../assets/Sales/Sunglasses.jpg'
import WomenKurti from '../../assets/Sales/Women-Kurti.jpg'
import WomenMakeupBrushSet from '../../assets/Sales/Women-Makeup-Brush-Set.jpeg'


const SaleComponent = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 21,
    minutes: 23,
    seconds: 12,
  });

  const products = [
    {
      id: 1,
      image: womenDressImg,
      name: "Sneakers",
      price: 5000,
      originalPrice: 7500,
      discount: "33% OFF",
      material: "Synthetic",
      rating: 4.8,
      reviews: 42,
    },
    {
      id: 2,
      image: CasioWatch,
      name: "Casio Watch",
      price: 7000,
      originalPrice: 9000,
      discount: "22% OFF",
      material: "Stainless Steel",
      rating: 4.6,
      reviews: 30,
    },
    {
      id: 3,
      image: CoupleSuit,
      name: "Couple Suit",
      price: 15000,
      originalPrice: 20000,
      discount: "25% OFF",
      material: "Cotton Blend",
      rating: 4.7,
      reviews: 25,
    },
    {
      id: 4,
      image: GoldenWomenCasual,
      name: "Golden Shirt",
      price: 3000,
      originalPrice: 4500,
      discount: "33% OFF",
      material: "Silk",
      rating: 4.5,
      reviews: 18,
    },
    {
      id: 5,
      image: RolexWatch,
      name: "Rolex Watch",
      price: 25000,
      originalPrice: 30000,
      discount: "16% OFF",
      material: "Gold-Plated",
      rating: 4.9,
      reviews: 50,
    },
    {
      id: 6,
      image: ShalwarQameez,
      name: "Shalwar Qameez",
      price: 4000,
      originalPrice: 5000,
      discount: "20% OFF",
      material: "Lawn",
      rating: 4.4,
      reviews: 20,
    },
    {
      id: 7,
      image: PinkSunglasses,
      name: "Pink Sunglasses",
      price: 1500,
      originalPrice: 2500,
      discount: "40% OFF",
      material: "Polycarbonate",
      rating: 4.6,
      reviews: 28,
    },
    {
      id: 8,
      image: WomenKurti,
      name: "Women Kurti",
      price: 2000,
      originalPrice: 3000,
      discount: "33% OFF",
      material: "Cotton",
      rating: 4.5,
      reviews: 35,
    },
    {
      id: 9,
      image: WomenMakeupBrushSet,
      name: "Makeup Brush Set",
      price: 1800,
      originalPrice: 2500,
      discount: "28% OFF",
      material: "Synthetic Fibers",
      rating: 4.7,
      reviews: 40,
    },
  ];

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="text-4xl font-semibold text-blue-700 animate-blink">
          🔥 Flash Sale
        </div>

        {/* Countdown Timer */}
        <div className="text-center text-pink-500 text-2xl font-poppins font-extrabold shadow-lg rounded-xl p-6 bg-white">
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
      `}</style>

      {/* Infinite Product Carousel */}
      <div className="overflow-hidden my-4">
        <div className="flex animate-marquee">
          {products.map((product, index) => (
            <div
              key={product.id + index}
              className="flex-none w-64 bg-white p-4 rounded-lg shadow-md mx-2 mb-4 transition-all ease-in-out"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover rounded-lg"
              />
              <div className="text-center mt-2">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p className="text-gray-500">{product.material}</p>
                <div className="flex justify-center items-center space-x-2">
                  <span className="text-xl text-red-600 font-semibold">
                    Rs {product.price}
                  </span>
                  <span className="text-sm line-through text-gray-400">
                    Rs {product.originalPrice}
                  </span>
                  <span className="text-sm text-3xl text-green-500">{product.discount}</span>
                </div>
                <div className="flex justify-center items-center my-2">
                  <span className="text-yellow-400">{product.rating} ★</span>
                  <span className="text-gray-500 ml-2">({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex justify-center my-4">
                <a href="/product-overview">
                  <button className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                    View Product
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Flash Sale Products Button */}
      <div className="flex justify-center my-6">
        <a href="/sale-products" >
        <button className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition">
          View All Flash Sale Products
        </button>
        </a>
      </div>
    </div>
  );
};

export default SaleComponent;
