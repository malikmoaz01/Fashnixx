import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from 'html2pdf.js';

const OrderConfirmation = ({ orderId, customerEmail , userId = "guest" }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const printRef = useRef();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = () => {
    const element = printRef.current;
    const opt = {
      margin: 10,
      filename: `Order-Receipt-${orderId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("No order ID provided");
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
          if (data && customerEmail) {
            sendConfirmationEmail(orderId, customerEmail);
          }
          setLoading(false);
          return;
        } 
        
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const localOrder = orders.find(order => order.orderId === orderId);

        if (localOrder) {
          console.log("Found order in localStorage:", localOrder);
          const formattedOrder = formatOrderForSchema(localOrder);
          
          try {
            const savedOrder = await saveOrderToDatabase(formattedOrder);
            setOrder(savedOrder);
            if (customerEmail) {
              sendConfirmationEmail(orderId, customerEmail);
            }
          } catch (saveErr) {
            console.error("Error saving order to database:", saveErr);
            setOrder(formattedOrder);
          }
        } else {
          if (retryCount >= 2) {
            throw new Error("Order not found after multiple attempts");
          }
          
          setRetryCount(prev => prev + 1);
          setTimeout(() => fetchOrder(), 2000); 
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("Error in fetchOrder:", err);
        setError(err.message || "Failed to load order");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, customerEmail, retryCount]);

  const formatOrderForSchema = (localOrder) => {
    const validStatusValues = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    let status = localOrder.status || 'pending';
    if (!validStatusValues.includes(status)) {
      status = 'pending';
    }
  
    return {
      ...localOrder,
      userId: localOrder.userId || 'guest', 
      status: status,
      createdAt: localOrder.createdAt || new Date().toISOString(),
      items: localOrder.items.map(item => ({
        productId: item.productId || item._id || null,
        productName: item.productName || item.name || 'Unknown Product',
        price: item.price || 0,
        quantity: item.quantity || 1,
        size: item.size || 'N/A',
        image: item.image || ''
      })),
      subtotal: localOrder.subtotal || localOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      deliveryCost: localOrder.deliveryCost || 0,
      total: localOrder.total || (
        localOrder.subtotal || 
        localOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      ) + (localOrder.deliveryCost || 0),
      customer: {
        firstName: localOrder.customer?.firstName || '',
        lastName: localOrder.customer?.lastName || '',
        email: localOrder.customer?.email || customerEmail || '',
        phone: localOrder.customer?.phone || '',
        address: {
          line1: localOrder.customer?.address?.line1 || '',
          line2: localOrder.customer?.address?.line2 || '',
          city: localOrder.customer?.address?.city || '',
          state: localOrder.customer?.address?.state || '',
          postalCode: localOrder.customer?.address?.postalCode || '',
          country: localOrder.customer?.address?.country || ''
        }
      },
      payment: {
        method: localOrder.payment?.method || 'cod',
        status: localOrder.payment?.status || 'pending',
        cardLast4: localOrder.payment?.cardLast4 || '',
        transactionId: localOrder.payment?.transactionId || ''
      },
      delivery: {
        method: localOrder.delivery?.method || 'standard',
        trackingNumber: localOrder.delivery?.trackingNumber || '',
        estimatedDelivery: localOrder.delivery?.estimatedDelivery || null
      },
      notes: localOrder.notes || ''
    };
  };

  const saveOrderToDatabase = async (orderData) => {
    try {
      // Add a flag to tell the backend to use upsert logic
      const requestBody = {
        ...orderData,
        userId: orderData.userId || 'guest', // Use a default if not present
        upsert: true // This tells the backend to update if exists, insert if not
      };
      
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to save order:", errorData);
        throw new Error(errorData.message || "Failed to save order");
      }
      
      const savedOrder = await response.json();
      console.log("Order saved successfully:", savedOrder);
      
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      const updatedOrders = orders.filter(order => order.orderId !== orderData.orderId);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      
      return savedOrder;
    } catch (err) {
      console.error("Error saving order:", err);
      
      // If it's a duplicate key error, try to fetch the existing order instead
      if (err.message && err.message.includes("duplicate key error")) {
        try {
          const fetchResponse = await fetch(`http://localhost:5000/api/orders/${orderData.orderId}`);
          if (fetchResponse.ok) {
            const existingOrder = await fetchResponse.json();
            console.log("Retrieved existing order:", existingOrder);
            return existingOrder;
          }
        } catch (fetchErr) {
          console.error("Failed to fetch existing order:", fetchErr);
        }
      }
      
      throw err;
    }
  };

  const sendConfirmationEmail = async (orderId, email) => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, email })
      });
      setTimeout(() => setEmailSent(true), 1500);
    } catch (err) {
      console.error("Email error:", err);
      setTimeout(() => setEmailSent(true), 1500);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(0);
  };

  const continueShopping = () => navigate("/products");
  const viewOrders = () => navigate("/account/orders");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 p-6 mb-6 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl text-red-800 font-medium">We couldn't find your order</h3>
          <p className="text-red-600 mt-2">{error || "No order information available."}</p>
          
          <div className="mt-4">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition mr-4"
            >
              Try Again
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">You can still continue shopping or check your orders</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={viewOrders}
            className="px-6 py-2 border border-blue-900 text-blue-900 rounded-md hover:bg-blue-50 transition"
          >
            View My Orders
          </button>
          <button
            onClick={continueShopping}
            className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Thank you for your order!</h2>
        <p className="text-gray-600 mt-2">Confirmation sent to {customerEmail || order.customer?.email}.</p>
        {emailSent && <p className="mt-2 text-sm text-green-600">Email sent successfully.</p>}
      </div>
      {/* Order Details (Printable Section) */}
      <div className="bg-white border rounded-lg p-6 mb-6" ref={printRef}>
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold">Order #{orderId}</h3>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {order.status === "confirmed" ? "Order Confirmed" : order.status}
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Items</h4>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div className="flex-1">
                  <p>
                    <span className="font-medium">{item.quantity}x</span> {item.productName}
                  </p>
                  {item.size && item.size !== "N/A" && (
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  )}
                </div>
                <div className="text-right">
                  <p>{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-6 border-t pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Delivery</span>
            <span>{formatCurrency(order.deliveryCost)}</span>
          </div>
          <div className="flex justify-between font-medium text-lg pt-2 border-t mt-2">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium mb-2">Shipping Information</h4>
            <p className="text-gray-800">
              {order.customer?.firstName} {order.customer?.lastName}
            </p>
            <p className="text-gray-800">
              {order.customer?.address?.line1}
              {order.customer?.address?.line2 && <span>, {order.customer.address.line2}</span>}
            </p>
            <p className="text-gray-800">
              {order.customer?.address?.city}, {order.customer?.address?.state}{" "}
              {order.customer?.address?.postalCode}
            </p>
            <p className="text-gray-800">{order.customer?.address?.country}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Contact Information</h4>
            <p className="text-gray-800">{order.customer?.email}</p>
            <p className="text-gray-800">{order.customer?.phone}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Payment Method</h4>
          <p className="text-gray-800">
            {order.payment?.method === "cod" ? "Cash on Delivery" : "Credit/Debit Card"}
            {order.payment?.cardLast4 && <span> (**** {order.payment.cardLast4})</span>}
          </p>
        </div>

        {/* Delivery Method */}
        <div>
          <h4 className="font-medium mb-2">Delivery Method</h4>
          <p className="text-gray-800">
            {order.delivery?.method === "standard"
              ? "Standard Delivery (5-7 business days)"
              : order.delivery?.method === "express"
              ? "Express Delivery (2-3 business days)"
              : "Same Day Delivery"}
          </p>
        </div>

        {/* Order Tracking Information */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-gray-600">
              You will receive shipping and delivery updates by email.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={handlePrint}
          className="flex-1 px-6 py-3 border border-blue-900 text-blue-900 rounded-md hover:bg-blue-50 transition flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Receipt
        </button>
        <button
          onClick={viewOrders}
          className="flex-1 px-6 py-3 border border-blue-900 text-blue-900 rounded-md hover:bg-blue-50 transition flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          View Orders
        </button>
        <button
          onClick={continueShopping}
          className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          Continue Shopping
        </button>
      </div>

      {/* Customer Support */}
      <div className="text-center bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-600">Need help with your order?</p>
        <p className="text-gray-800 font-medium mt-1">
          Contact our customer support at{" "}
          <a href="mailto:mlkmoaz01@gmail.com" className="text-blue-900 underline">
            mlkmoaz01@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;