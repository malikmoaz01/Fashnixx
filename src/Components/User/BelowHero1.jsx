import React from 'react';
import FreeDelivery from '../../assets/free-delivery.jpg'
import CustomerSupport from '../../assets/customer-support.jpg'
import MoneyBack from '../../assets/Money.png'

const BelowHero1 = () => {
  return (
    <div className="bg-gradient-to-r from-blue-200 to-pink-300 py-4 px-2">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row justify-between gap-1">
        
        <div className="flex flex-col items-center text-center p-2 border border-blue-300 rounded-md shadow-sm bg-white flex-1 mb-1 sm:mb-0">
          <img src={FreeDelivery} alt="Free Delivery" className="w-6 h-6 mb-1" />
          <h3 className="text-xs font-semibold text-blue-700">FREE DELIVERY</h3>
          <p className="text-xs text-gray-600">Orders over Rs 1300</p>
        </div>
        
        <div className="flex flex-col items-center text-center p-2 border border-pink-300 rounded-md shadow-sm bg-white flex-1 mb-1 sm:mb-0">
          <img src={CustomerSupport} alt="Customer Service" className="w-6 h-6 mb-1" />
          <h3 className="text-xs font-semibold text-pink-700">24/7 SUPPORT</h3>
          <p className="text-xs text-gray-600">Always available</p>
        </div>
        
        <div className="flex flex-col items-center text-center p-2 border border-blue-300 rounded-md shadow-sm bg-white flex-1">
          <img src={MoneyBack} alt="Money Back Guarantee" className="w-6 h-6 mb-1" />
          <h3 className="text-xs font-semibold text-blue-700">MONEY BACK</h3>
          <p className="text-xs text-gray-600">30 days guarantee</p>
        </div>
        
      </div>
    </div>
  );
};

export default BelowHero1;