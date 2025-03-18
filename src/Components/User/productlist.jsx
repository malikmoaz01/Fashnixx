import React, { useState, useEffect } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchProducts();
  }, []);

  const categories = [...new Set(products.map(product => product.category))];

  useEffect(() => {
    const filtered = products.filter(product => 
      product.price >= minPrice &&
      product.price <= maxPrice &&
      product.rating >= minRating &&
      (selectedCategory === '' || product.category === selectedCategory)
    );
    setFilteredProducts(filtered);
  }, [minPrice, maxPrice, minRating, selectedCategory, products]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8">All Products</h1>
      
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <div>
          <label className="text-gray-700 text-sm">Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="block mt-1 p-2 border rounded w-32"
          />
        </div>

        <div>
          <label className="text-gray-700 text-sm">Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="block mt-1 p-2 border rounded w-32"
          />
        </div>

        <div>
          <label className="text-gray-700 text-sm">Min Rating</label>
          <input
            type="number"
            step="0.1"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="block mt-1 p-2 border rounded w-32"
          />
        </div>

        <div>
          <label className="text-gray-700 text-sm">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block mt-1 p-2 border rounded w-40"
          >
            <option value="">All</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No Products Found</p>
        ) : (
          filteredProducts.map((product) => {
            const outOfStock = product.stock === 0;
            return (
              <div
                key={product._id}
                className={`relative bg-white shadow-md rounded-lg overflow-hidden transition hover:scale-105 ${outOfStock ? 'opacity-50' : ''}`}
              >
                {/* Out of Stock Badge */}
                {outOfStock && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}

                {/* Product Image */}
                <div className="w-full h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                  <p className="text-sm text-gray-500">{product.category}</p>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold text-blue-800">
                      Rs. {product.discountPrice || product.price}
                    </span>
                    {product.discountPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        Rs. {product.price}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center mt-1 text-yellow-500">
                    <span className="font-medium">{product.rating} ★</span>
                    <span className="text-xs text-gray-400 ml-2">({product.reviews} reviews)</span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">{product.description.slice(0, 60)}...</p>

                  <button
                    disabled={outOfStock}
                    className={`mt-4 w-full py-2 rounded ${
                      outOfStock
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } transition`}
                  >
                    {outOfStock ? 'Unavailable' : 'View Details'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductList;
