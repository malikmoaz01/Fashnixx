import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentMethod = ({ paymentData, updatePaymentData, onNext, onBack }) => {
  const [selectedMethod, setSelectedMethod] = useState(paymentData.method);
  const [cardError, setCardError] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const stripe = useStripe();
  const elements = useElements();

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    updatePaymentData({ method });
  };

  const handleCardChange = (event) => {
    setCardError(event.error ? event.error.message : "");
    setCardComplete(event.complete);
  };

  const validateCardPayment = async () => {
    if (!stripe || !elements) {
      // Stripe hasn't loaded yet
      return false;
    }
    
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      return false;
    }
    
    setIsProcessing(true);
    
    // For demo purposes, we're not making an actual charge
    // In a real app, you would create a payment intent on your server
    // and confirm it here
    
    // Instead, we'll just simulate card validation
    const { token, error } = await stripe.createToken(cardElement);
    
    setIsProcessing(false);
    
    if (error) {
      setCardError(error.message);
      return false;
    }
    
    if (token) {
      // Store the last 4 digits of the card for display in the review step
      updatePaymentData({
        method: "card",
        cardDetails: {
          last4: token.card.last4,
          brand: token.card.brand
        }
      });
      return true;
    }
    
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedMethod === "cod") {
      // No validation needed for COD
      onNext();
      return;
    }
    
    if (selectedMethod === "card") {
      if (!cardComplete) {
        setCardError("Please complete your card details");
        return;
      }
      
      const success = await validateCardPayment();
      if (success) {
        onNext();
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Options */}
        <div className="space-y-4">
          {/* Cash on Delivery */}
          <div
            className={`border rounded-lg p-4 transition cursor-pointer ${
              selectedMethod === "cod"
                ? "border-blue-900 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleMethodChange("cod")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                checked={selectedMethod === "cod"}
                onChange={() => handleMethodChange("cod")}
                className="h-4 w-4 text-blue-900 border-gray-300 focus:ring-blue-900"
              />
              <label htmlFor="cod" className="ml-3 cursor-pointer flex justify-between w-full">
                <div className="flex items-center">
                  <div className="bg-gray-200 p-2 rounded-md mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-900 font-medium">Cash on Delivery</span>
                </div>
                <span className="text-green-700 font-medium">Free</span>
              </label>
            </div>
            {selectedMethod === "cod" && (
              <div className="mt-3 ml-7 text-sm text-gray-600">
                Pay with cash when your order is delivered.
              </div>
            )}
          </div>

          {/* Credit/Debit Card */}
          <div
            className={`border rounded-lg p-4 transition cursor-pointer ${
              selectedMethod === "card"
                ? "border-blue-900 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleMethodChange("card")}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="card"
                name="paymentMethod"
                checked={selectedMethod === "card"}
                onChange={() => handleMethodChange("card")}
                className="h-4 w-4 text-blue-900 border-gray-300 focus:ring-blue-900"
              />
              <label htmlFor="card" className="ml-3 cursor-pointer flex justify-between w-full">
                <div className="flex items-center">
                  <div className="bg-gray-200 p-2 rounded-md mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-900 font-medium">Credit / Debit Card</span>
                </div>
                <div className="flex space-x-1">
                  <img src="/visa.svg" alt="Visa" className="h-6" />
                  <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
                </div>
              </label>
            </div>
            {selectedMethod === "card" && (
              <div className="mt-3 ml-7">
                <div className="p-3 border border-gray-300 rounded-md bg-white">
                  <CardElement options={cardStyle} onChange={handleCardChange} />
                </div>
                {cardError && <div className="text-red-500 text-sm mt-2">{cardError}</div>}
                <div className="text-xs text-gray-500 mt-2">
                  Your card information is secure and encrypted.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isProcessing}
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Review Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethod;