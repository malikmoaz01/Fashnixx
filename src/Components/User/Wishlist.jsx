import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlistItems = async () => {
      try {
        setLoading(true);
        
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        const productDetails = {};
        
        for (const item of storedWishlist) {
          if (!productDetails[item.productId]) {
            try {
              const res = await fetch(`http://localhost:5000/api/products/${item.productId}`);
              if (res.ok) {
                const data = await res.json();
                productDetails[item.productId] = data;
              } else {
                console.error(`Failed to fetch product ${item.productId}`);
              }
            } catch (err) {
              console.error(`Error fetching product ${item.productId}:`, err);
            }
          }
        }
        
        setProducts(productDetails);
        setWishlistItems(storedWishlist);
        setLoading(false);
      } catch (err) {
        console.error('Error loading wishlist:', err);
        toast.error('Failed to load wishlist items');
        setLoading(false);
      }
    };

    loadWishlistItems();
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(
      item => item.productId !== productId
    );
    
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    window.dispatchEvent(new Event('storageUpdated'));
    
    toast.success('Item removed from wishlist!');
  };

  const addToCart = (productId) => {
    try {
      const product = products[productId];
      if (!product) {
        toast.error('Product not found');
        return;
      }
      
      const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
      
      const wishlistItem = wishlistItems.find(item => item.productId === productId);
      
      const existingCartItemIndex = currentCart.findIndex(
        item => item.productId === productId && item.size === (wishlistItem.size || 'default')
      );
      
      if (existingCartItemIndex >= 0) {
        currentCart[existingCartItemIndex].quantity += 1;
      } else {
        currentCart.push({
          productId,
          quantity: 1,
          size: wishlistItem.size || 'default'
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(currentCart));
      
      window.dispatchEvent(new Event('storageUpdated'));
      
      toast.success('Item added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="p-8 max-w-6xl mx-auto text-center bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Your Wishlist is Empty</h1>
          <p className="text-gray-500 mb-8 text-lg max-w-md">You haven't saved any items to your wishlist yet. Start exploring and save items you love!</p>
          <Link to="/products">
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full hover:from-indigo-700 hover:to-purple-700 transition shadow-lg flex items-center">
              <span>Explore Products</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 md:px-8 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
        <span className="ml-3 bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => {
          const product = products[item.productId];
          if (!product) return null;
          
          return (
            <div
              key={item.productId}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={product.images && product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                
                {product.discountPrice && (
                  <div className="absolute top-3 left-3 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-md">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </div>
                )}
                
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-3 right-3 bg-white text-red-500 p-1.5 rounded-full shadow-sm hover:text-red-700 hover:bg-red-50 transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
              
              <div className="p-5">
                <h2 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-1">{product.name}</h2>
                
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      {product.discountPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-gray-900">Rs {product.discountPrice}</span>
                          <span className="text-gray-500 line-through text-sm">Rs {product.price}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-lg text-gray-900">Rs {product.price}</span>
                      )}
                    </div>
                    
                    {item.size && (
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded">
                        Size: {item.size}
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => addToCart(item.productId)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-sm flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {wishlistItems.length > 0 && (
        <div className="mt-8 flex justify-between items-center">
          <Link to="/products">
            <button className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Continue Shopping
            </button>
          </Link>
          
          <button
            onClick={() => {
              wishlistItems.forEach(item => addToCart(item.productId));
              toast.success('All items added to cart!');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          >
            Add All to Cart
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;