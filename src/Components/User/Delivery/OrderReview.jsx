import React from "react";

const OrderReview = ({ checkoutData, cartItems, products, onPlaceOrder, onBack }) => {
  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="border rounded-lg divide-y">
          <div className="p-4">
            <h3 className="font-medium text-lg mb-2">Order Items</h3>
            <div className="space-y-4 mt-4">
              {cartItems.map((item) => {
                const product = products[item.productId];
                if (!product) return null;
                
                const price = product.discountPrice || product.price;
                const itemTotal = price * item.quantity;
                
                return (
                  <div key={`${item.productId}-${item.size || "default"}`} className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={product.images && product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && " | "}
                            {item.color && `Color: ${item.color}`}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatCurrency(itemTotal)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(checkoutData.subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Delivery</span>
              <span>{formatCurrency(checkoutData.delivery.cost)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200 mt-2">
              <span>Total</span>
              <span>{formatCurrency(checkoutData.orderTotal)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-lg mb-2">Shipping Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-gray-600 text-sm">Contact</p>
              <p className="font-medium">
                {checkoutData.customer.firstName} {checkoutData.customer.lastName}
              </p>
              <p>{checkoutData.customer.email}</p>
              <p>{checkoutData.customer.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Address</p>
              <p className="font-medium">
                {checkoutData.customer.address.line1}
                {checkoutData.customer.address.line2 && `, ${checkoutData.customer.address.line2}`}
              </p>
              <p>
                {checkoutData.customer.address.city}, {checkoutData.customer.address.state}{" "}
                {checkoutData.customer.address.postalCode}
              </p>
              <p>{checkoutData.customer.address.country}</p>
            </div>
          </div>
        </div>

        {/* Delivery Method */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-lg mb-2">Delivery Method</h3>
          <div className="mt-2">
            <p className="font-medium capitalize">
              {checkoutData.delivery.method === "standard" ? "Standard Delivery" : 
               checkoutData.delivery.method === "express" ? "Express Delivery" : 
               "Same Day Delivery"}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {checkoutData.delivery.method === "standard" ? "3-5 business days" : 
               checkoutData.delivery.method === "express" ? "1-2 business days" : 
               "Same day delivery (order before 2 PM)"}
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-lg mb-2">Payment Method</h3>
          <div className="mt-2">
            {checkoutData.payment.method === "cod" ? (
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
                <span>Cash On Delivery</span>
              </div>
            ) : (
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
                <div>
                  <span className="capitalize font-medium">
                    {checkoutData.payment.cardDetails?.brand || "Credit/Debit"} Card
                  </span>
                  {checkoutData.payment.cardDetails?.last4 && (
                    <p className="text-sm text-gray-600">
                      **** **** **** {checkoutData.payment.cardDetails.last4}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Agreement and Buttons */}
        <div className="pt-4">
          <div className="mb-6 text-sm text-gray-600">
            By placing your order, you agree to our{" "}
            <a href="/terms" className="text-blue-900 underline">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-900 underline">
              Privacy Policy
            </a>
            .
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onPlaceOrder}
              className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;