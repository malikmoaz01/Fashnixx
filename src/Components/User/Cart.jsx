import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        setLoading(true);
        
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const productDetails = {};
        
        for (const item of storedCart) {
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
        setCartItems(storedCart);
        setLoading(false);
      } catch (err) {
        console.error('Error loading cart:', err);
        toast.error('Failed to load cart items');
        setLoading(false);
      }
    };

    loadCartItems();
  }, []);

  const updateQuantity = (productId, size, newQuantity) => {
    const updatedCart = cartItems.map(item => {
      if (item.productId === productId && item.size === size) {
        return { ...item, quantity: Math.max(newQuantity, 1) };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Cart updated!');
  };

  const removeItem = (productId, size) => {
    const updatedCart = cartItems.filter(
      item => !(item.productId === productId && item.size === size)
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Item removed from cart!');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const product = products[item.productId];
      if (!product) return sum;
      
      const price = product.discountPrice || product.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-8 max-w-6xl mx-auto text-center bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8 text-lg max-w-md">Looks like you haven't added anything to your cart yet. Explore our products and find something you'll love!</p>
          <Link to="/products">
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full hover:from-indigo-700 hover:to-purple-700 transition shadow-lg flex items-center">
              <span>Start Shopping</span>
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
        <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
        <span className="ml-3 bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
          {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {cartItems.map((item) => {
            const product = products[item.productId];
            if (!product) return null;
            
            return (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex flex-col sm:flex-row gap-6 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="w-full sm:w-28 sm:h-28 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.images && product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div>
                      <h2 className="font-semibold text-xl text-gray-800 mb-1">{product.name}</h2>
                      <p className="text-gray-500 text-sm mb-2">
                        Size: <span className="font-medium text-gray-700">{item.size || "Standard"}</span>
                      </p>
                      
                      {product.discountPrice && (
                        <div className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-md mb-2">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 sm:mt-0 text-right">
                      {product.discountPrice ? (
                        <>
                          <p className="text-lg font-bold text-gray-900">Rs {product.discountPrice}</p>
                          <p className="text-sm text-gray-500 line-through">Rs {product.price}</p>
                        </>
                      ) : (
                        <p className="text-lg font-bold text-gray-900">Rs {product.price}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 font-medium text-gray-800 bg-gray-50">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="flex items-center text-red-500 hover:text-red-700 transition mt-4 sm:mt-0"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="mt-8">
            <Link to="/products">
              <button className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                <span>Rs {subtotal}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>Rs {subtotal}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
              </div>
            </div>
            
            <Link to="/checkout">
              <button className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md flex items-center justify-center">
                Proceed to Checkout
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </Link>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center text-gray-500 text-sm">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Secure Checkout
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                  Multiple Payment Options
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;