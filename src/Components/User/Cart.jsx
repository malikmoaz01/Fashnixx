import React, { useState } from "react";
import womenDressImg from "../../assets/Sneakers.jpg";
import CasioWatch from "../../assets/Sales/Casio-Watch.jpg";
import CoupleSuit from "../../assets/Sales/Couple-Suit.jpg";
import GoldenWomenCasual from "../../assets/Sales/Golden-Shirt.png";
import RolexWatch from "../../assets/Sales/Rolex-Watch.jpg";
import ShalwarQameez from "../../assets/Sales/Shalwar-Qameez.jpg";
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      image: womenDressImg,
      name: "Sneakers",
      price: 5000,
      originalPrice: 7500,
      discount: "33% OFF",
      material: "Synthetic",
      size: 44,
      quantity: 1,
    },
    {
      id: 2,
      image: CasioWatch,
      name: "Casio Watch",
      price: 7000,
      originalPrice: 9000,
      discount: "22% OFF",
      material: "Stainless Steel",
      size: "Small",
      quantity: 1,
    },
    {
      id: 3,
      image: CoupleSuit,
      name: "Couple Suit",
      price: 15000,
      originalPrice: 20000,
      discount: "25% OFF",
      material: "Cotton Blend",
      size: "XL",
      quantity: 1,
    },
    {
      id: 4,
      image: GoldenWomenCasual,
      name: "Golden Shirt",
      price: 3000,
      originalPrice: 4500,
      discount: "33% OFF",
      material: "Silk",
      size: "XL",
      quantity: 1,
    },
    {
      id: 5,
      image: RolexWatch,
      name: "Rolex Watch",
      price: 25000,
      originalPrice: 30000,
      discount: "16% OFF",
      material: "Gold-Plated",
      size: "XL",
      quantity: 1,
    },
    {
      id: 6,
      image: ShalwarQameez,
      name: "Shalwar Qameez",
      price: 4000,
      originalPrice: 5000,
      discount: "20% OFF",
      material: "Lawn",
      quantity: 1,
    },
  ]);

  const updateQuantity = (id, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(newQuantity, 1) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center justify-between border border-blue-800 rounded-md p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover"
                />
                <div>
                  <h2 className="font-bold">{item.name}</h2>
                  <p className="text-sm text-gray-600">Material: {item.material}</p>
                  <p className="text-sm text-gray-600">
                    Size: {item.size || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="text-right">
                  <p className="text-gray-500 line-through text-sm">
                    Rs {item.originalPrice}
                  </p>
                  <p className="text-lg font-bold">Rs {item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 border rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 border rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Section */}
        <div className="w-full md:w-1/3 border border-blue-900 rounded-md p-4">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between border-b py-2">
            <span>Subtotal</span>
            <span>Rs {subtotal}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between text-lg font-bold py-2">
            <span>Total</span>
            <span>Rs {subtotal}</span>
          </div>
          <Link to="/checkout">
  <button className="bg-blue-900 text-white w-full py-2 rounded-md mt-4 hover:bg-blue-700 transition">
    Proceed to Checkout
  </button>
</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
