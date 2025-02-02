import React from 'react';
import './Appp.css';
import blackJeans from '../../assets/Recomended/black-jeans.jpeg';
import BlackSuit from '../../assets/Recomended/Black-Suit.jpg';
import CasualBlackShirt from '../../assets/Recomended/Casual-Black-Shirt.jpeg';
import GreenTshirt from '../../assets/Recomended/Green-TShirt.jpg';

const ProductOverview1 = () => {
  const products = [
    {
      id: 1,
      image: blackJeans,
      name: 'Black Jeans',
      price: 4500,
      originalPrice: 10000,
      discount: 'Save 25% Now!',
      rating: 4.5,
      reviews: 38,
      material: 'Denim',
      availableSizes: ['S', 'M', 'L', 'XL'],
      stock: 5,
      color: 'Black',
    },
    {
      id: 2,
      image: BlackSuit,
      name: 'Black Suit',
      price: 8000,
      originalPrice: 16000,
      discount: 'Limited Time Offer - 50% OFF',
      rating: 4.8,
      reviews: 45,
      material: 'Wool',
      availableSizes: ['M', 'L', 'XL'],
      stock: 3,
      color: 'Black',
    },
    {
      id: 3,
      image: CasualBlackShirt,
      name: 'Casual Black Shirt',
      price: 1500,
      originalPrice: 3000,
      discount: '30% OFF',
      rating: 4.7,
      reviews: 50,
      material: 'Cotton',
      availableSizes: ['M', 'L', 'XL'],
      stock: 10,
      color: 'Black',
    },
    {
      id: 4,
      image: GreenTshirt,
      name: 'Green T-Shirt',
      price: 1200,
      originalPrice: 2400,
      discount: '50% OFF',
      rating: 4.6,
      reviews: 60,
      material: 'Polyester',
      availableSizes: ['M', 'L', 'XL'],
      stock: 7,
      color: 'Green',
    },
    // Duplicate products are omitted here for brevity
  ];

  return (
    <div className="p-6">
      {/* Section Title */}
      <h2 className="text-left text-4xl font-bold mb-8 pl-4 flex space-x-1">
        {Array.from("Related Products").map((letter, index) => (
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
      <section className="mx-auto grid max-w-full grid-cols-1 gap-6 px-0 pb-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col rounded-lg overflow-hidden group bg-white shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <div className="relative group">
              <img
                className="h-64 w-full object-cover rounded-t-lg"
                src={product.image}
                alt={`${product.name} image`}
              />
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 opacity-0 group-hover:opacity-100">
                <a
                  href="/product-overview"
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
                </a>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute top-2 right-2 bg-pink-400 px-2 py-1 text-xs font-semibold">
                {product.discount}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-lg font-semibold text-gray-800">{product.name}</p>
              <div className="flex justify-between items-center">
                <p className="text-xl font-bold text-blue-900">
                  Rs. {product.price.toFixed(0)}{' '}
                  <span className="text-sm font-normal text-gray-400 line-through">
                    Rs. {product.originalPrice.toFixed(0)}
                  </span>
                </p>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Material:</strong> {product.material}</p>
                <p><strong>Available Sizes:</strong> {product.availableSizes.join(', ')}</p>
                <p><strong>Color:</strong> {product.color}</p>
              </div>

              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                    className={`h-5 w-5 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
                <p className="text-sm text-gray-500">({product.reviews})</p>
              </div>

              <button className="mt-4 w-full bg-blue-900 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 rounded-full">
                Quick View
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ProductOverview1;
