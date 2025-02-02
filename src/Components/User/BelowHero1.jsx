import React from 'react';
import FreeDelivery from '../../assets/free-delivery.jpg'
import CustomerSupport from '../../assets/customer-support.jpg'
import MoneyBack from '../../assets/Money.png'

const BelowHero1 = () => {
  return (
    <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md">
          <img src={FreeDelivery} alt="Free Delivery" className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">FREE AND FAST DELIVERY</h3>
          <p className="text-sm text-gray-600">Free delivery for all orders over Rs 1300</p>
        </div>
        <div className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md">
          <img src={CustomerSupport} alt="Customer Service" className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 CUSTOMER SERVICE</h3>
          <p className="text-sm text-gray-600">Friendly 24/7 customer support</p>
        </div>
        <div className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md">
          <img src={MoneyBack} alt="Money Back Guarantee" className="w-16 h-12 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">MONEY BACK GUARANTEE</h3>
          <p className="text-sm text-gray-600">We return money within 30 days</p>
        </div>
      </div>
    </div>
  );
};

export default BelowHero1;
