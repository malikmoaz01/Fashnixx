import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddressForm from "./Delivery/Address";
import DeliveryMethod from "./Delivery/DeliveryMethod";
import PaymentMethod from "./Delivery/PaymentMethod";
import OrderReview from "./Delivery/OrderReview";
import OrderConfirmation from "./Delivery/OrderConfirmation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_your_stripe_publishable_key");

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState({
    customer: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Pakistan",
      },
    },
    delivery: {
      method: "standard",
      cost: 0,
    },
    payment: {
      method: "cod",
      cardDetails: null,
    },
    orderTotal: 0,
    subtotal: 0,
    orderId: "",
  });

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        setLoading(true);
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        
        if (storedCart.length === 0) {
          navigate("/cart");
          toast.error("Your cart is empty");
          return;
        }

        const productDetails = {};
        let subtotal = 0;
        
        for (const item of storedCart) {
          if (!productDetails[item.productId]) {
            try {
              const res = await fetch(
                `http://localhost:5000/api/products/${item.productId}`
              );
              if (res.ok) {
                const data = await res.json();
                productDetails[item.productId] = data;
                
                // Calculate price
                const price = data.discountPrice || data.price;
                subtotal += price * item.quantity;
              } else {
                console.error(`Failed to fetch product ${item.productId}`);
              }
            } catch (err) {
              console.error(`Error fetching product ${item.productId}:`, err);
            }
          } else {
            const price = productDetails[item.productId].discountPrice || 
                         productDetails[item.productId].price;
            subtotal += price * item.quantity;
          }
        }
        
        setProducts(productDetails);
        setCartItems(storedCart);
        setCheckoutData(prev => ({
          ...prev,
          subtotal,
          orderTotal: subtotal
        }));
        setLoading(false);
      } catch (err) {
        console.error("Error loading cart:", err);
        toast.error("Failed to load cart items");
        setLoading(false);
      }
    };

    loadCartItems();
  }, [navigate]);

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
    window.scrollTo(0, 0);
  };

  const updateCheckoutData = (section, data) => {
    setCheckoutData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const updateDeliveryMethod = (method, cost) => {
    setCheckoutData((prev) => ({
      ...prev,
      delivery: { method, cost },
      orderTotal: prev.subtotal + cost,
    }));
  };

  const placeOrder = async () => {
    try {
      setLoading(true);
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const order = {
        orderId,
        customer: checkoutData.customer,
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: products[item.productId]?.name || "Unknown Product",
          quantity: item.quantity,
          size: item.size || "N/A",
          price: products[item.productId]?.discountPrice || products[item.productId]?.price
        })),
        delivery: checkoutData.delivery,
        payment: {
          method: checkoutData.payment.method,
          cardLast4: checkoutData.payment.cardDetails?.last4 || null
        },
        subtotal: checkoutData.subtotal,
        deliveryCost: checkoutData.delivery.cost,
        total: checkoutData.orderTotal,
        status: "confirmed",
        createdAt: new Date().toISOString()
      };
      
      console.log("Order placed:", order);
      
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));
      setCheckoutData(prev => ({
        ...prev,
        orderId
      }));
    
      await sendOrderConfirmationEmail(order);
      localStorage.setItem("cart", JSON.stringify([]));
      window.dispatchEvent(new Event('storageUpdated'));
      
      setLoading(false);
      nextStep(); 
      
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
      setLoading(false);
    }
  };
  
  const sendOrderConfirmationEmail = async (order) => {
    try {
      console.log("Sending confirmation email for order:", order.orderId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddressForm
            customerData={checkoutData.customer}
            updateCustomerData={(data) => updateCheckoutData("customer", data)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <DeliveryMethod
            selectedMethod={checkoutData.delivery.method}
            updateDeliveryMethod={updateDeliveryMethod}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <Elements stripe={stripePromise}>
            <PaymentMethod
              paymentData={checkoutData.payment}
              updatePaymentData={(data) => updateCheckoutData("payment", data)}
              onNext={nextStep}
              onBack={prevStep}
            />
          </Elements>
        );
      case 4:
        return (
          <OrderReview
            checkoutData={checkoutData}
            cartItems={cartItems}
            products={products}
            onPlaceOrder={placeOrder}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <OrderConfirmation
            orderId={checkoutData.orderId}
            customerEmail={checkoutData.customer.email}
             userId="guest"
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  }; 

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {["Address", "Delivery", "Payment", "Review", "Confirmation"].map(
          (step, index) => (
            <div
              key={step}
              className={`flex-1 text-center relative ${
                index < currentStep
                  ? "text-blue-900"
                  : index === currentStep - 1
                  ? "text-blue-900 font-semibold"
                  : "text-gray-400"
              }`}
            >
              <div className="mb-2 relative z-10">
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                    index < currentStep
                      ? "bg-blue-900 text-white"
                      : index === currentStep - 1
                      ? "bg-blue-900 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </span>
              </div>
              <div className="text-xs sm:text-sm">{step}</div>
              {index < 4 && (
                <div
                  className={`hidden sm:block absolute top-4 w-full h-0.5 ${
                    index < currentStep - 1 ? "bg-blue-900" : "bg-gray-200"
                  }`}
                  style={{ left: "50%" }}
                ></div>
              )}
            </div>
          )
        )}
      </div>

      {/* Current Step Content */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
        {renderStep()}
      </div>
    </div>
  );
};

export default Checkout;