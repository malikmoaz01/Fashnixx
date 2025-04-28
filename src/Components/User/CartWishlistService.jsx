// CartWishlistService.js
import { toast } from 'react-toastify';

export const addToCart = async (productId, size, quantity, navigate) => {
  try {
    // Get current cart from localStorage or initialize empty array
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if this item (same product and size) already exists in cart
    const existingItemIndex = currentCart.findIndex(
      item => item.productId === productId && item.size === size
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      currentCart[existingItemIndex].quantity += quantity;
      toast.success('Cart updated successfully!');
    } else {
      // Add new item to cart
      currentCart.push({
        productId,
        size,
        quantity,
        addedAt: new Date().toISOString()
      });
      toast.success('Item added to cart!');
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // Optional: Navigate to cart page
    // navigate('/cart');
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error('Failed to add item to cart. Please try again.');
  }
};

export const addToWishlist = async (productId, navigate) => {
  try {
    // Get current wishlist from localStorage or initialize empty array
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if this product already exists in wishlist
    const existingItem = currentWishlist.find(
      item => item.productId === productId
    );
    
    if (existingItem) {
      toast.info('This item is already in your wishlist!');
    } else {
      // Add new item to wishlist
      currentWishlist.push({
        productId,
        addedAt: new Date().toISOString()
      });
      
      // Save updated wishlist to localStorage
      localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
      toast.success('Item added to wishlist!');
    }
    
    // Optional: Navigate to wishlist page
    // navigate('/wishlist');
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    toast.error('Failed to add item to wishlist. Please try again.');
  }
};