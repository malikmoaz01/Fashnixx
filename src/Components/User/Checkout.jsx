import React, { useState } from "react";
import womenDressImg from "../../assets/Sneakers.jpg";
import CasioWatch from "../../assets/Sales/Casio-Watch.jpg";
import CoupleSuit from "../../assets/Sales/Couple-Suit.jpg";
import GoldenWomenCasual from "../../assets/Sales/Golden-Shirt.png";
import RolexWatch from "../../assets/Sales/Rolex-Watch.jpg";
import ShalwarQameez from "../../assets/Sales/Shalwar-Qameez.jpg";

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItems] = useState([
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

  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleDiscountApply = () => {
    if (discountCode === "Ecom") {
      setDiscountApplied(true);
    } else {
      alert("Invalid discount code.");
    }
  };

  const discountAmount = discountApplied ? subtotal * 0.1 : 0;
  const totalAfterDiscount = subtotal - discountAmount;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Step Navigation */}
      <div className="flex justify-between border-b-2 pb-2 mb-4">
        {[
          "Address",
          "Delivery Method",
          "Payment Method",
          "Order Review",
          "Confirmation",
        ].map((label, index) => (
          <button
            key={index}
            onClick={() => setStep(index + 1)}
            disabled={step > 4} // Disable when on Confirmation page
            className={`px-4 py-2 ${
              step === index + 1 ? "font-bold text-blue-600" : "text-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="border rounded-md p-4">
        {step === 1 && <AddressForm />}
        {step === 2 && <DeliveryMethod />}
        {step === 3 && (
          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        )}
        {step === 4 && (
          <OrderReview
            cartItems={cartItems}
            subtotal={subtotal}
            discountAmount={discountAmount}
            totalAfterDiscount={totalAfterDiscount}
            setDiscountCode={setDiscountCode}
            handleDiscountApply={handleDiscountApply}
          />
        )}
        {step === 5 && <Confirmation />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        {step > 1 && step < 5 && (
          <button
            onClick={prevStep}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Back
          </button>
        )}
        {step < 5 && (
          <button
            onClick={nextStep}
            disabled={step === 3 && paymentMethod === ""}
            className={`px-4 py-2 rounded-md ${
              step === 3 && paymentMethod === ""
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-900 text-white hover:bg-blue-800"
            }`}
          >
            {step === 4 ? "Confirm Order" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
};





// Address Form Component
const AddressForm = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Address Form</h2>
    <form className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        className="w-full border rounded-md p-2"
        required
      />
      <input
        type="email"
        placeholder="Email Address"
        className="w-full border rounded-md p-2"
        required
      />
      <input
        type="text"
        placeholder="Street"
        className="w-full border rounded-md p-2"
        required
      />
      <input
        type="text"
        placeholder="City"
        className="w-full border rounded-md p-2"
        required
      />
      <input
        type="text"
        placeholder="ZIP Code"
        className="w-full border rounded-md p-2"
        required
      />
    </form>
  </div>
);





// Delivery Method Component
const DeliveryMethod = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Delivery Method</h2>
    <fieldset>
      <legend className="sr-only">Choose delivery method</legend>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="delivery"
          value="standard"
          className="w-4 h-4"
          defaultChecked
        />
        <span>Standard Delivery (Free)</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="delivery"
          value="express"
          className="w-4 h-4"
        />
        <span>Express Delivery (Rs 500)</span>
      </label>
    </fieldset>
  </div>
);






// Payment Method Component
const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Payment Method</h2>
    <fieldset>
      <legend className="sr-only">Choose payment method</legend>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="payment"
          value="creditCard"
          checked={paymentMethod === "creditCard"}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-4 h-4"
        />
        <span>Credit/Debit Card</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="payment"
          value="cash"
          checked={paymentMethod === "cash"}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-4 h-4"
        />
        <span>Cash on Delivery</span>
      </label>
    </fieldset>

    {paymentMethod === "creditCard" && (
      <form className="mt-4 space-y-4">
        <input
          type="text"
          placeholder="Card Number"
          className="w-full border rounded-md p-2"
          required
        />
        <input
          type="text"
          placeholder="Cardholder Name"
          className="w-full border rounded-md p-2"
          required
        />
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Expiry Date (MM/YY)"
            className="flex-1 border rounded-md p-2"
            required
          />
          <input
            type="text"
            placeholder="CVV"
            className="w-1/4 border rounded-md p-2"
            required
          />
        </div>
      </form>
    )}
  </div>
);





// Order Review Component
const OrderReview = ({
  cartItems,
  subtotal,
  discountAmount,
  totalAfterDiscount,
  setDiscountCode,
  handleDiscountApply,
}) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Order Review</h2>
    <div className="space-y-4">
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b pb-2 mb-2"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div>
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600">
                Material: {item.material || "N/A"}
              </p>
              <p className="text-sm text-gray-600">Size: {item.size || "N/A"}</p>
              <p className="text-sm text-green-500">{item.discount}</p>
            </div>
          </div>
          <div className="text-right">
            <p>Rs {item.price.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="flex justify-between mt-4">
      <input
        type="text"
        placeholder="Enter Discount Code"
        className="w-1/2 border rounded-md p-2"
        onChange={(e) => setDiscountCode(e.target.value)}
      />
      <button
        onClick={handleDiscountApply}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Apply
      </button>
    </div>

    <div className="mt-4 border-t pt-4 text-right">
      <p>Subtotal: Rs {subtotal.toLocaleString()}</p>
      {discountAmount > 0 && (
        <p className="text-red-500">
          Discount Applied: Rs {discountAmount.toLocaleString()}
        </p>
      )}
      <strong>Total: Rs {totalAfterDiscount.toLocaleString()}</strong>
    </div>
  </div>
);






// Confirmation Component
const Confirmation = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Order Confirmation</h2>
    <p>Your order has been placed successfully! 🎉</p>
  </div>
);

export default Checkout;
