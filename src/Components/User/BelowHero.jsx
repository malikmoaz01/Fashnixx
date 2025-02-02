import React from 'react';
import { useNavigate } from 'react-router-dom';
import menTshirtImg from '../../assets/Categories/TShirt.png';
import womenDressImg from '../../assets/Categories/Women.jpg';
import kidsWearImg from '../../assets/Categories/Kids.jpeg';
import menShoesImg from '../../assets/Categories/Shoes.jpg';
import womenShoesImg from '../../assets/Categories/women.png';
import accessoriesImg from '../../assets/Categories/Watches.jpg';

const BelowHero = () => {
  const navigate = useNavigate();

  const categories = [
    { image: menTshirtImg, label: "Men's T-Shirts", path: '/menswear/tshirts' },
    { image: womenDressImg, label: "Women's Dresses", path: '/womenswear/dresses' },
    { image: kidsWearImg, label: "Kids Wear", path: '/kidswear/dresses' },
    { image: menShoesImg, label: "Men's Shoes", path: '/menswear/shoes' },
    { image: womenShoesImg, label: "Women's Shoes", path: '/womenswear/shoes' },
    { image: accessoriesImg, label: "Accessories", path: '/accessories' },
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Heading */}
      <div className="text-left mt-5 mb-8 pl-4">
        <h2 className="text-4xl font-bold flex space-x-1">
          {Array.from("Shopping By Categories").map((letter, index) => (
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
      </div>

      {/* Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
            onClick={() => navigate(category.path)}
            style={{ aspectRatio: '3 / 2' }}
          >
            {/* Background Image */}
            <img
              className="h-full w-full object-cover brightness-50 transition-all duration-500 group-hover:brightness-100 group-hover:scale-105"
              src={category.image}
              alt={`${category.label} category`}
            />

            {/* Category Label */}
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-white text-lg font-semibold uppercase tracking-wide bg-black bg-opacity-70 px-3 py-1 rounded transition-opacity duration-300 group-hover:bg-opacity-100">
              {category.label}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default BelowHero;
